var REGEX = /@hackprinceton\.com$/;

function hasHackPrincetonRecipient(messageViews) {
    for (var messageView of messageViews) {
        var recipients = messageView.getRecipients();
        for (var recipient of recipients) {
            if (REGEX.test(recipient.emailAddress))
                return true;
        }
    }
    return false;
}

function getSender(messageViews) {
    for (var messageView of messageViews) {
        var contacts = messageView.getRecipients();
        contacts.unshift(messageView.getSender());

        for (var contact of contacts) {
            if (!REGEX.test(contact.emailAddress))
                return contact.emailAddress;
        }
    }
    return null;
}

function loadUser(el, email) {
    el.setAttribute("src", "https://hackprinceton.com/embed/userByEmail/" + email);
}

InboxSDK.load('1', 'sdk_hackprinceton_f57b081a28').then(function (sdk) {

    sdk.Conversations.registerThreadViewHandler(function (threadView) {
        var messageViews = threadView.getMessageViews();
        
        if (hasHackPrincetonRecipient(messageViews)) {
            var el = document.createElement("iframe");
            el.setAttribute("style", "border: none; width: 100%; height: 150px;");

            var originalSender = getSender(messageViews);

            if (originalSender) {
                loadUser(el, originalSender);
            }

            threadView.addSidebarContentPanel({
                el: el,
                title: "HackPrinceton",
                iconUrl: chrome.extension.getURL("icon.png")
            });

            threadView.on("contactHover", function (e) {
                loadUser(el, e.contact.emailAddress);
            });
        }
    });

});
