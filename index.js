import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import bodyParser from "body-parser";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import pg from "pg";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
// import { spawnSync } from 'child_process';
import crypto from 'crypto';
import flash from 'connect-flash'

const app = express();
// const hostname = '192.168.1.125';
const port = 3000;
const server = createServer(app);
const io = new Server(server);
// const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new pg.Client({
    user: "postgres",
    password: "chessman",
    database: "chat_app",
    host: "localhost",
    port: 5432
})
const saltRounds = 10;

db.connect()
    .then(() => {
        console.log("Connected to database")
    })
    .catch((error) => {
        console.log("Error connecting to database", error)
    })

app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended:true }))
app.use(session({
    secret: "SECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use((req, res, next) => {
    res.locals.welcome_msg = req.flash('welcome_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
})

passport.use(new Strategy( {passReqToCallback: true}, async function verify(req, username, password, cb) {
        try {
            const result = await db.query("SELECT * FROM users WHERE username = $1", [username])

            if (result.rows.length === 0) {
                req.flash('error_msg', 'Invalid email or password');
                return cb(null, false)
            }

            const user = result.rows[0]

            const passwordMatch = await bcrypt.compare(password, user.password_hash);

            if (!passwordMatch) {
                req.flash('error_msg', 'Invalid email or password');
                return cb(null, false);
            }

            return cb(null, user);

        }
        catch(err) {
            console.error('Authentication error', err);
            // return cb(null, false);
        }
    }
)
);

passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.post("/",
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/",
        failureFlash: true
}));

var userIdQuery = 0;
app.get("/home", async(req, res) => {
    if (req.isAuthenticated()) {
        req.flash('welcome_msg', "Welcome back")
        res.render("index.ejs", { user: req.user });
    } else {
        console.log(req.flash('error_msg'))
        res.redirect("/");
    }
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/")
    })
})

app.get("/signup", (req, res) => {
    res.render("register.ejs")
})

app.post("/signup", async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
        return res.render("register.ejs",
            {
                badPass: "Passwords don't match",
                formData: {username, email}
            }
        )
    }

    try {
        const checkResult = await db.query("SELECT 1 FROM users WHERE email = $1 OR username = $2", [email, username])

        if (checkResult.rows.length > 0) {
            console.log("Email or username already exists")
            req.flash("error_msg", "Email or username already exists");
            return res.redirect("/signup");
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);
        const userID = uuidv4();

        await db.query("INSERT INTO users (email, password_hash, username, user_id) VALUES ($1, $2, $3, $4)", [email, passwordHash, username, userID])

        console.log("User inserted with ID:", userID)

        const user = {email, username, user_id: userID};

        req.login(user, (err) => {
            if (err) {
                req.flash('error_msg', 'Auto-login failed');
                return res.redirect("/");
            }
            req.flash('welcome_msg', 'Account created successfully!');
            return res.redirect("/home");
        });

    } catch (error) {
        req.flash("error_msg", "Registration failed")
        return res.redirect("/signup")
    }
})

io.on('connect', (socket) => {
    console.log('Connected');
    socket.on('message', (msg) => {
        io.emit('message', msg); 
        const messageContent = msg.message;

        // Function to generate RSA keys (public and private)
        const generateRSAKeys = () => {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem',
                },
            });
            return { publicKey, privateKey };
        };
        
        // Function to encrypt a message with AES and encrypt the AES key with RSA
        const encryptMessage = (message, recipientPublicKey) => {
            // Generate random AES session key
            const sessionKey = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16); // Initialization vector for AES encryption
        
            // Encrypt the message with AES (AES-GCM for authenticated encryption)
            const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey, iv);
            let encryptedMessage = cipher.update(message, 'utf8', 'hex');
            encryptedMessage += cipher.final('hex');
            const authTag = cipher.getAuthTag();
        
            // Encrypt the AES session key with recipient's public RSA key
            const encryptedSessionKey = crypto.publicEncrypt(
                recipientPublicKey,
                sessionKey
            );
        
            // Return encrypted session key, iv, auth tag, and encrypted message
            return {
                encryptedSessionKey: encryptedSessionKey.toString('base64'),
                iv: iv.toString('base64'),
                authTag: authTag.toString('base64'),
                encryptedMessage: encryptedMessage,
            };
        };
        
        // Function to decrypt the message using the private RSA key and AES session key
        const decryptMessage = (encryptedSessionKey, iv, authTag, encryptedMessage, recipientPrivateKey ) => {
            // Decrypt the AES session key with recipient's private RSA key
            const decryptedSessionKey = crypto.privateDecrypt(
                recipientPrivateKey,
                Buffer.from(encryptedSessionKey, 'base64')
            );
        
            // Decrypt the message using AES with the decrypted session key
            const decipher = crypto.createDecipheriv(
                'aes-256-gcm',
                decryptedSessionKey,
                Buffer.from(iv, 'base64')
            );
            decipher.setAuthTag(Buffer.from(authTag, 'base64'));
        
            let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
            decryptedMessage += decipher.final('utf8');
        
            return decryptedMessage;
        };
        
        // Main function to demonstrate E2EE
        const main = () => {
            // Generate RSA keys for two users (simulating User A and User B)
            const { publicKey: publicKeyA, privateKey: privateKeyA } = generateRSAKeys();
            const { publicKey: publicKeyB, privateKey: privateKeyB } = generateRSAKeys();
        
            // console.log(`User A Public Key: ${publicKeyA}`);
            // console.log(`User B Private Key: ${privateKeyB}`);
        
            // User A wants to send a message to User B
            const message = messageContent;
        
            // Encrypt the message using User B's public key
            const encryptedData = encryptMessage(message, publicKeyB);
        
            // console.log('\nEncrypted Data:', encryptedData);
        
            // Now User B decrypts the message with their private key
            const decryptedMessage = decryptMessage(
                encryptedData.encryptedSessionKey,
                encryptedData.iv,
                encryptedData.authTag,
                encryptedData.encryptedMessage,
                privateKeyB
            );
        
            // console.log(`\nDecrypted Message: ${decryptedMessage}`);
        };
        
        main();        

        async function appendToDbms() {
            try {
                if (userIdQuery && userIdQuery.rows && userIdQuery.rows.length > 0) {
                    const senderIDQuery = await db.query(
                        "SELECT user_id FROM users WHERE email = $1",
                        [userIdQuery.rows[0].email]
                    );
                    if (senderIDQuery.rows && senderIDQuery.rows.length > 0) {
                        const senderID = senderIDQuery.rows[0].user_id;
                        await db.query("INSERT INTO messages (sender_id, message) VALUES ($1, $2)", [senderID, messageContent]);
                    } else {
                        console.log("No sender ID found for the given email.");
                    }
                } else {
                    console.log("userIdQuery is not populated or has no rows.");
                }
            } catch (error) {
                console.error("Error fetching sender ID:", error);
            }
        };              

        setTimeout(async () => {
            await appendToDbms();
        }, 3000);
    });
});

server.listen(port, () => {
    console.log(`Server up and listening on port ${port}`);
});
