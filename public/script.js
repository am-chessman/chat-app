$(function() {
    const socket = io();
    let socketId;

    socket.on("connect", () => {
        socketId = socket.id;
    });

    var INDEX = 0;

    $("#chat-submit").click(function(e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() === '') {
            return false;
        }

        const messageData = {
            id: socketId,
            message: msg
        };

        socket.emit("message", messageData);

        generate_message(msg, 'self');
    });

    socket.on("message", function(data) {
        if (data.id !== socketId) {
            generate_message(data.message, 'other');
        }
    });

    function generate_message(msg, type) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class='chat-msg " + type + "'>";
        str += "          <div class='cm-msg-text'>";
        str += msg;
        str += "          </div>";
        str += "        </div>";

        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type === 'self') {
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }
});

