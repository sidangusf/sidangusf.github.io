// Interactive preview of the 1Million Secrets iOS app on the home page.
// Layout, copy and behavior mirror apps/ios in the app repository. It is a demo only:
// nothing typed here is sent, stored, or leaves the browser.
//
// The text follows the language picked on the page (assets/i18n.js). When it changes, the
// preview is rebuilt in the new language from a fresh start.
(function () {
  "use strict";
  var first = document.querySelector("[data-oms-sim]");
  if (!first) return;

  // ---------- Copy, per language: shared/Strings.kt in the app repo, plus preview-only lines ----------
  var STRINGS = /*STRINGS*/{
    "en": {
      "aboutMessageTitle": "About this message",
      "aboutMessageBody": "You can't reply, and the sender isn't told whether you've read it.",
      "hideMessageTitle": "Hide this message?",
      "hideReceivedBody": "It will be removed from your inbox on all your devices, and you won't be able to get it back.",
      "blockTitle": "Block this sender?",
      "blockBody": "You won't receive messages from this sender again. They won't be told, and you still won't learn who they are.",
      "blocked": "You won't receive messages from this sender again. They won't be told.",
      "reportDone": "Thanks. Your report was received.",
      "removeAllTitle": "Remove all text?",
      "removeAllBody": "This clears everything you've written.",
      "useCreditTitle": "Use 1 credit?",
      "useCreditBody": "Your free send isn't ready, so this send costs 1 credit. You'll have {left} left.",
      "nextFreeSend": "Your next free send is {time}. Buy credits or watch ads to earn credits and send now.",
      "adDailyLimit": "You've reached today's 3 rewarded ads. More are available after {time}.",
      "inbox": "Inbox",
      "sent": "Sent",
      "account": "Account",
      "write": "Write",
      "close": "Close",
      "yourMessage": "Your message",
      "removeAllText": "Remove all text",
      "copyAllText": "Copy all text",
      "removeRedWords": "Remove the words in red to send.",
      "credits": "Credits",
      "buy10": "Buy 10",
      "watchAd": "Watch ad",
      "syncPurchases": "Sync purchases",
      "accountStatus": "Account status",
      "goodStanding": "Good standing",
      "settings": "Settings",
      "preferences": "Preferences",
      "removeAds": "Remove ads",
      "oneTimePurchase": "One time purchase",
      "back": "Back",
      "moreActions": "More actions",
      "cancel": "Cancel",
      "hide": "Hide",
      "report": "Report",
      "reported": "Reported",
      "blockSender": "Block sender",
      "block": "Block",
      "removeAll": "Remove all",
      "textRemoved": "Text removed",
      "undo": "Undo",
      "copiedToClipboard": "Copied to clipboard",
      "sendFree": "Send free",
      "sendForCredit": "Send for 1 credit",
      "sendingYourMessage": "Sending your message…",
      "sentSuccessfully": "Sent successfully",
      "statusSent": "Sent",
      "statusReceived": "Received",
      "yesterday": "Yesterday",
      "writeInfo": "One Million Secrets is a place to share a secret with the world without worrying about being judged, or simply to send a kind word to a stranger. A real person will read your message, so please be kind and respectful.\n\nYour message goes to one random person, without your name. One Million Secrets can see it for safety. The person who receives it can share it, so don't include anything that identifies you or anyone else.\n\nThe person who receives your message can report it if they feel disrespected or unsafe. Reports can get your account banned for a period of time, and repeated reports can lead to a permanent ban.",
      "creditsInfo": "Credits never expire. 1 credit buys 1 extra send or 1 extra receive. Each ad earns 1 credit, up to 3 ads a day.",
      "emptyInbox": "No messages yet. Messages arrive at random, so there's no set time.",
      "emptySent": "Messages you write appear here, with their status.",
      "aboutWrite": "About Write",
      "aboutCredits": "About Credits",
      "creditOne": "credit",
      "creditMany": "credits",
      "streakOne": "Daily streak: 1 day",
      "streakMany": "Daily streak: {count} days",
      "simLabel": "Interactive preview of the 1Million Secrets iPhone app",
      "tabs": "Tabs",
      "placeholder": "Write a secret, or a kind word for a stranger…",
      "demoNote": "This is a preview, so nothing leaves your browser.",
      "previewEarned": "Preview: you earned 1 credit. In the app, a short video ad plays first.",
      "previewBuy": "Preview: credits are bought in the app through the App Store or Google Play.",
      "inboxSamples": [
        "I finally told my mom I'm proud of her. She cried, then I cried. Whoever reads this: call yours if you can.",
        "Today I ate lunch alone in my car and it was the best twenty minutes of my week. Rest is allowed.",
        "I still keep a voicemail from my grandpa. I play it on the days I forget who I am.",
        "Nobody at work knows I'm learning piano at 41. Three songs in. Still terrible. Still happy.",
        "To the stranger reading this: you're doing better than you think. Really.",
        "I said yes to the job across the country. Terrified. Excited. Mostly terrified."
      ],
      "sentSamples": [
        "Some days I pretend to be busy so no one asks how I'm doing. Today I'm actually okay, and I wanted someone to know.",
        "I planted tomatoes from seed this spring. Forty of them. I have no idea what to do with forty tomato plants.",
        "I forgave my brother last week. I never told him. I just felt it go.",
        "If you're reading this on a hard day, drink some water and open a window. Small things count."
      ]
    },
    "fr": {
      "aboutMessageTitle": "À propos de ce message",
      "aboutMessageBody": "Vous ne pouvez pas répondre, et l'expéditeur ne sait pas si vous l'avez lu.",
      "hideMessageTitle": "Masquer ce message ?",
      "hideReceivedBody": "Il sera retiré de votre boîte de réception sur tous vos appareils, et vous ne pourrez pas le récupérer.",
      "blockTitle": "Bloquer cet expéditeur ?",
      "blockBody": "Vous ne recevrez plus de messages de cet expéditeur. Il n'en sera pas informé, et vous ne saurez toujours pas qui il est.",
      "blocked": "Vous ne recevrez plus de messages de cet expéditeur. Il n'en sera pas informé.",
      "reportDone": "Merci. Votre signalement a bien été reçu.",
      "removeAllTitle": "Supprimer tout le texte ?",
      "removeAllBody": "Tout ce que vous avez écrit sera effacé.",
      "useCreditTitle": "Utiliser 1 crédit ?",
      "useCreditBody": "Votre envoi gratuit n'est pas encore disponible : cet envoi coûte 1 crédit. Il vous en restera {left}.",
      "nextFreeSend": "Votre prochain envoi gratuit : {time}. Achetez des crédits ou regardez des pubs pour en gagner et envoyer maintenant.",
      "adDailyLimit": "Vous avez atteint les 3 pubs avec récompense du jour. D'autres seront disponibles après le {time}.",
      "inbox": "Boîte de réception",
      "sent": "Envoyés",
      "account": "Compte",
      "write": "Écrire",
      "close": "Fermer",
      "yourMessage": "Votre message",
      "removeAllText": "Supprimer tout le texte",
      "copyAllText": "Copier tout le texte",
      "removeRedWords": "Supprimez les mots en rouge pour envoyer.",
      "credits": "Crédits",
      "buy10": "Acheter 10",
      "watchAd": "Regarder une pub",
      "syncPurchases": "Synchroniser les achats",
      "accountStatus": "État du compte",
      "goodStanding": "En règle",
      "settings": "Réglages",
      "preferences": "Préférences",
      "removeAds": "Supprimer les pubs",
      "oneTimePurchase": "Achat unique",
      "back": "Retour",
      "moreActions": "Plus d'actions",
      "cancel": "Annuler",
      "hide": "Masquer",
      "report": "Signaler",
      "reported": "Signalé",
      "blockSender": "Bloquer l'expéditeur",
      "block": "Bloquer",
      "removeAll": "Tout supprimer",
      "textRemoved": "Texte supprimé",
      "undo": "Annuler",
      "copiedToClipboard": "Copié dans le presse-papiers",
      "sendFree": "Envoyer gratuitement",
      "sendForCredit": "Envoyer pour 1 crédit",
      "sendingYourMessage": "Envoi de votre message…",
      "sentSuccessfully": "Envoyé avec succès",
      "statusSent": "Envoyé",
      "statusReceived": "Reçu",
      "yesterday": "Hier",
      "writeInfo": "One Million Secrets est un lieu où partager un secret avec le monde sans craindre d'être jugé, ou simplement envoyer un mot gentil à un inconnu. Une vraie personne lira votre message, alors soyez bienveillant et respectueux.\n\nVotre message est envoyé à une personne au hasard, sans votre nom. One Million Secrets peut le voir pour des raisons de sécurité. La personne qui le reçoit peut le partager : n'incluez rien qui permette de vous identifier, vous ou quelqu'un d'autre.\n\nLa personne qui reçoit votre message peut le signaler si elle ne se sent pas respectée ou en sécurité. Les signalements peuvent entraîner la suspension de votre compte pendant un certain temps, et des signalements répétés peuvent mener à une suspension définitive.",
      "creditsInfo": "Les crédits n'expirent jamais. 1 crédit permet 1 envoi ou 1 réception supplémentaire. Chaque pub rapporte 1 crédit, jusqu'à 3 pubs par jour.",
      "emptyInbox": "Aucun message pour l'instant. Les messages arrivent au hasard : il n'y a pas d'heure fixe.",
      "emptySent": "Les messages que vous écrivez apparaissent ici, avec leur statut.",
      "aboutWrite": "À propos : Écrire",
      "aboutCredits": "À propos : Crédits",
      "creditOne": "crédit",
      "creditMany": "crédits",
      "streakOne": "Série quotidienne : {count} jour",
      "streakMany": "Série quotidienne : {count} jours",
      "simLabel": "Aperçu interactif de l'application iPhone 1Million Secrets",
      "tabs": "Onglets",
      "placeholder": "Écrivez un secret, ou un mot gentil pour un inconnu…",
      "demoNote": "Ceci est un aperçu : rien ne quitte votre navigateur.",
      "previewEarned": "Aperçu : vous avez gagné 1 crédit. Dans l'application, une courte vidéo publicitaire est d'abord diffusée.",
      "previewBuy": "Aperçu : les crédits s'achètent dans l'application, via l'App Store ou Google Play.",
      "inboxSamples": [
        "J'ai enfin dit à ma mère que j'étais fier d'elle. Elle a pleuré, puis j'ai pleuré. Qui que vous soyez : appelez la vôtre si vous le pouvez.",
        "Aujourd'hui, j'ai déjeuné seul dans ma voiture et ce furent les vingt meilleures minutes de ma semaine. Se reposer, c'est permis.",
        "Je garde encore un message vocal de mon grand-père. Je l'écoute les jours où j'oublie qui je suis.",
        "Personne au travail ne sait que j'apprends le piano à 41 ans. Trois morceaux appris. Toujours nul. Toujours heureux.",
        "À l'inconnu qui lit ceci : tu t'en sors mieux que tu ne le crois. Vraiment.",
        "J'ai dit oui au poste à l'autre bout du pays. Terrifié. Excité. Surtout terrifié."
      ],
      "sentSamples": [
        "Certains jours, je fais semblant d'être occupé pour qu'on ne me demande pas comment je vais. Aujourd'hui, je vais vraiment bien, et je voulais que quelqu'un le sache.",
        "J'ai semé des tomates ce printemps. Quarante plants. Je n'ai aucune idée de ce que je vais faire de quarante plants de tomates.",
        "J'ai pardonné à mon frère la semaine dernière. Je ne le lui ai jamais dit. Je l'ai juste senti partir.",
        "Si tu lis ceci un jour difficile, bois un verre d'eau et ouvre une fenêtre. Les petites choses comptent."
      ]
    },
    "es": {
      "aboutMessageTitle": "Acerca de este mensaje",
      "aboutMessageBody": "No puedes responder, y el remitente no sabe si lo has leído.",
      "hideMessageTitle": "¿Ocultar este mensaje?",
      "hideReceivedBody": "Se quitará de tu bandeja de entrada en todos tus dispositivos y no podrás recuperarlo.",
      "blockTitle": "¿Bloquear a este remitente?",
      "blockBody": "No volverás a recibir mensajes de este remitente. No se le avisará, y seguirás sin saber quién es.",
      "blocked": "No volverás a recibir mensajes de este remitente. No se le avisará.",
      "reportDone": "Gracias. Hemos recibido tu denuncia.",
      "removeAllTitle": "¿Borrar todo el texto?",
      "removeAllBody": "Se borrará todo lo que has escrito.",
      "useCreditTitle": "¿Usar 1 crédito?",
      "useCreditBody": "Tu envío gratis aún no está listo, así que este envío cuesta 1 crédito. Te quedarán {left}.",
      "nextFreeSend": "Tu próximo envío gratis: {time}. Compra créditos o mira anuncios para ganarlos y enviar ahora.",
      "adDailyLimit": "Has alcanzado los 3 anuncios con recompensa de hoy. Habrá más después del {time}.",
      "inbox": "Recibidos",
      "sent": "Enviados",
      "account": "Cuenta",
      "write": "Escribir",
      "close": "Cerrar",
      "yourMessage": "Tu mensaje",
      "removeAllText": "Borrar todo el texto",
      "copyAllText": "Copiar todo el texto",
      "removeRedWords": "Elimina las palabras en rojo para enviar.",
      "credits": "Créditos",
      "buy10": "Comprar 10",
      "watchAd": "Ver anuncio",
      "syncPurchases": "Sincronizar compras",
      "accountStatus": "Estado de la cuenta",
      "goodStanding": "En regla",
      "settings": "Ajustes",
      "preferences": "Preferencias",
      "removeAds": "Quitar anuncios",
      "oneTimePurchase": "Compra única",
      "back": "Atrás",
      "moreActions": "Más acciones",
      "cancel": "Cancelar",
      "hide": "Ocultar",
      "report": "Denunciar",
      "reported": "Denunciado",
      "blockSender": "Bloquear remitente",
      "block": "Bloquear",
      "removeAll": "Borrar todo",
      "textRemoved": "Texto eliminado",
      "undo": "Deshacer",
      "copiedToClipboard": "Copiado al portapapeles",
      "sendFree": "Enviar gratis",
      "sendForCredit": "Enviar por 1 crédito",
      "sendingYourMessage": "Enviando tu mensaje…",
      "sentSuccessfully": "Enviado correctamente",
      "statusSent": "Enviado",
      "statusReceived": "Recibido",
      "yesterday": "Ayer",
      "writeInfo": "One Million Secrets es un lugar para compartir un secreto con el mundo sin miedo a ser juzgado, o simplemente para enviar unas palabras amables a un desconocido. Una persona real leerá tu mensaje, así que sé amable y respetuoso.\n\nTu mensaje llega a una persona al azar, sin tu nombre. One Million Secrets puede verlo por seguridad. Quien lo reciba puede compartirlo, así que no incluyas nada que te identifique a ti ni a otras personas.\n\nLa persona que reciba tu mensaje puede denunciarlo si siente que no la respetan o que no está segura. Las denuncias pueden suspender tu cuenta durante un tiempo, y las denuncias repetidas pueden llevar a una suspensión permanente.",
      "creditsInfo": "Los créditos nunca caducan. 1 crédito da 1 envío o 1 recepción extra. Cada anuncio da 1 crédito, hasta 3 anuncios al día.",
      "emptyInbox": "Aún no hay mensajes. Los mensajes llegan al azar, así que no hay una hora fija.",
      "emptySent": "Los mensajes que escribes aparecen aquí, con su estado.",
      "aboutWrite": "Acerca de: Escribir",
      "aboutCredits": "Acerca de: Créditos",
      "creditOne": "crédito",
      "creditMany": "créditos",
      "streakOne": "Racha diaria: {count} día",
      "streakMany": "Racha diaria: {count} días",
      "simLabel": "Vista previa interactiva de la aplicación 1Million Secrets para iPhone",
      "tabs": "Pestañas",
      "placeholder": "Escribe un secreto, o unas palabras amables para un desconocido…",
      "demoNote": "Esto es una vista previa: nada sale de tu navegador.",
      "previewEarned": "Vista previa: has ganado 1 crédito. En la aplicación, primero se reproduce un breve anuncio en vídeo.",
      "previewBuy": "Vista previa: los créditos se compran en la aplicación a través del App Store o Google Play.",
      "inboxSamples": [
        "Por fin le dije a mi madre que estoy orgulloso de ella. Lloró, y luego lloré yo. Quien lea esto: llama a la tuya si puedes.",
        "Hoy comí solo en el coche y fueron los mejores veinte minutos de mi semana. Descansar está permitido.",
        "Todavía guardo un mensaje de voz de mi abuelo. Lo escucho los días en que olvido quién soy.",
        "Nadie en el trabajo sabe que estoy aprendiendo piano a los 41. Ya van tres canciones. Sigo tocando fatal. Sigo feliz.",
        "Al desconocido que lee esto: lo estás haciendo mejor de lo que crees. De verdad.",
        "Acepté el trabajo al otro lado del país. Aterrado. Ilusionado. Sobre todo aterrado."
      ],
      "sentSamples": [
        "Algunos días finjo estar ocupado para que nadie me pregunte cómo estoy. Hoy de verdad estoy bien, y quería que alguien lo supiera.",
        "Esta primavera planté tomates desde semilla. Cuarenta. No tengo ni idea de qué hacer con cuarenta tomateras.",
        "La semana pasada perdoné a mi hermano. Nunca se lo dije. Simplemente sentí que se iba.",
        "Si lees esto en un día difícil, bebe un poco de agua y abre una ventana. Las cosas pequeñas cuentan."
      ]
    },
    "zh": {
      "aboutMessageTitle": "关于这条消息",
      "aboutMessageBody": "你无法回复，发送者也不会知道你是否已读。",
      "hideMessageTitle": "隐藏这条消息？",
      "hideReceivedBody": "它将从你所有设备的收件箱中移除，且无法恢复。",
      "blockTitle": "屏蔽此发送者？",
      "blockBody": "你将不会再收到此发送者的消息。对方不会收到通知，你也仍然不会知道对方是谁。",
      "blocked": "你将不会再收到此发送者的消息，对方不会收到通知。",
      "reportDone": "谢谢，我们已收到你的举报。",
      "removeAllTitle": "删除全部文本？",
      "removeAllBody": "这会清除你写的所有内容。",
      "useCreditTitle": "使用 1 积分？",
      "useCreditBody": "你的免费发送次数尚未恢复，本次发送将花费 1 积分。发送后剩余 {left} 积分。",
      "nextFreeSend": "你的下一次免费发送时间为 {time}。购买积分或观看广告赚取积分，即可立即发送。",
      "adDailyLimit": "你已看完今天的 3 个激励广告。{time} 之后可以继续观看。",
      "inbox": "收件箱",
      "sent": "已发送",
      "account": "账户",
      "write": "写信",
      "close": "关闭",
      "yourMessage": "你的消息",
      "removeAllText": "删除全部文本",
      "copyAllText": "复制全部文本",
      "removeRedWords": "删除红色字词后才能发送。",
      "credits": "积分",
      "buy10": "购买 10 个",
      "watchAd": "观看广告",
      "syncPurchases": "同步购买",
      "accountStatus": "账户状态",
      "goodStanding": "状态良好",
      "settings": "设置",
      "preferences": "偏好设置",
      "removeAds": "移除广告",
      "oneTimePurchase": "一次性购买",
      "back": "返回",
      "moreActions": "更多操作",
      "cancel": "取消",
      "hide": "隐藏",
      "report": "举报",
      "reported": "已举报",
      "blockSender": "屏蔽发送者",
      "block": "屏蔽",
      "removeAll": "全部删除",
      "textRemoved": "文本已删除",
      "undo": "撤销",
      "copiedToClipboard": "已复制到剪贴板",
      "sendFree": "免费发送",
      "sendForCredit": "花费 1 积分发送",
      "sendingYourMessage": "正在发送你的消息…",
      "sentSuccessfully": "发送成功",
      "statusSent": "已发送",
      "statusReceived": "已送达",
      "yesterday": "昨天",
      "writeInfo": "One Million Secrets 是一个让你向世界分享秘密、不必担心被评判的地方，也可以只是给一位陌生人送上一句温暖的祝福。会有真实的人读到你的消息，所以请友善并尊重对方。\n\n你的消息会发送给一位随机的人，不会附带你的名字。出于安全考虑，One Million Secrets 可以看到它。收到消息的人可以分享它，所以请不要包含任何能识别你或他人身份的信息。\n\n如果收到消息的人感到不被尊重或不安全，可以举报你的消息。被举报可能导致你的账户被封禁一段时间，多次被举报可能导致永久封禁。",
      "creditsInfo": "积分永不过期。1 积分可额外发送 1 次或额外接收 1 次。每看一个广告可获得 1 积分，每天最多 3 个广告。",
      "emptyInbox": "还没有消息。消息随机送达，没有固定时间。",
      "emptySent": "你写的消息会显示在这里，并附有状态。",
      "aboutWrite": "关于“写信”",
      "aboutCredits": "关于“积分”",
      "creditOne": "积分",
      "creditMany": "积分",
      "streakOne": "连续天数：{count} 天",
      "streakMany": "连续天数：{count} 天",
      "simLabel": "1Million Secrets iPhone 应用的交互式预览",
      "tabs": "标签页",
      "placeholder": "写下一个秘密，或给陌生人的一句温暖的话…",
      "demoNote": "这只是预览，任何内容都不会离开你的浏览器。",
      "previewEarned": "预览：你获得了 1 积分。在应用中，会先播放一段简短的视频广告。",
      "previewBuy": "预览：积分需要在应用中通过 App Store 或 Google Play 购买。",
      "inboxSamples": [
        "我终于告诉妈妈我为她骄傲。她哭了，然后我也哭了。读到这条消息的人：如果可以，给你妈妈打个电话吧。",
        "今天我一个人在车里吃午饭，那是我这周最好的二十分钟。休息是被允许的。",
        "我至今还留着爷爷的一条语音留言。在我忘了自己是谁的日子里，我就放来听。",
        "公司里没人知道我 41 岁在学钢琴。已经学会三首曲子了。弹得还是很烂。但还是很开心。",
        "致读到这条消息的陌生人：你做得比你以为的要好。真的。",
        "我接受了国家另一头的那份工作。害怕。兴奋。主要是害怕。"
      ],
      "sentSamples": [
        "有些日子我会假装很忙，这样就没人问我过得怎么样。今天我其实还不错，想让某个人知道。",
        "今年春天我用种子种了番茄。四十棵。我完全不知道该拿四十棵番茄苗怎么办。",
        "上周我原谅了我哥哥。我从没告诉过他。我只是感觉到那份怨气消散了。",
        "如果你在难熬的一天读到这条消息，喝点水，打开窗户。小事也很重要。"
      ]
    },
    "vi": {
      "aboutMessageTitle": "Về tin nhắn này",
      "aboutMessageBody": "Bạn không thể trả lời, và người gửi không biết bạn đã đọc hay chưa.",
      "hideMessageTitle": "Ẩn tin nhắn này?",
      "hideReceivedBody": "Tin nhắn sẽ bị xóa khỏi hộp thư đến trên mọi thiết bị của bạn và bạn sẽ không thể lấy lại.",
      "blockTitle": "Chặn người gửi này?",
      "blockBody": "Bạn sẽ không nhận tin nhắn từ người gửi này nữa. Họ sẽ không được thông báo, và bạn vẫn sẽ không biết họ là ai.",
      "blocked": "Bạn sẽ không nhận tin nhắn từ người gửi này nữa. Họ sẽ không được thông báo.",
      "reportDone": "Cảm ơn. Báo cáo của bạn đã được tiếp nhận.",
      "removeAllTitle": "Xóa toàn bộ văn bản?",
      "removeAllBody": "Thao tác này sẽ xóa mọi thứ bạn đã viết.",
      "useCreditTitle": "Dùng 1 tín dụng?",
      "useCreditBody": "Lượt gửi miễn phí chưa sẵn sàng, nên lần gửi này tốn 1 tín dụng. Bạn sẽ còn {left}.",
      "nextFreeSend": "Lượt gửi miễn phí tiếp theo: {time}. Mua tín dụng hoặc xem quảng cáo để nhận tín dụng và gửi ngay.",
      "adDailyLimit": "Bạn đã xem đủ 3 quảng cáo có thưởng hôm nay. Có thêm sau {time}.",
      "inbox": "Hộp thư đến",
      "sent": "Đã gửi",
      "account": "Tài khoản",
      "write": "Viết",
      "close": "Đóng",
      "yourMessage": "Tin nhắn của bạn",
      "removeAllText": "Xóa toàn bộ văn bản",
      "copyAllText": "Sao chép toàn bộ văn bản",
      "removeRedWords": "Hãy xóa các từ màu đỏ để gửi.",
      "credits": "Tín dụng",
      "buy10": "Mua 10",
      "watchAd": "Xem quảng cáo",
      "syncPurchases": "Đồng bộ giao dịch mua",
      "accountStatus": "Trạng thái tài khoản",
      "goodStanding": "Tình trạng tốt",
      "settings": "Cài đặt",
      "preferences": "Tùy chọn",
      "removeAds": "Xóa quảng cáo",
      "oneTimePurchase": "Mua một lần",
      "back": "Quay lại",
      "moreActions": "Thao tác khác",
      "cancel": "Hủy",
      "hide": "Ẩn",
      "report": "Báo cáo",
      "reported": "Đã báo cáo",
      "blockSender": "Chặn người gửi",
      "block": "Chặn",
      "removeAll": "Xóa tất cả",
      "textRemoved": "Đã xóa văn bản",
      "undo": "Hoàn tác",
      "copiedToClipboard": "Đã sao chép vào bộ nhớ tạm",
      "sendFree": "Gửi miễn phí",
      "sendForCredit": "Gửi với 1 tín dụng",
      "sendingYourMessage": "Đang gửi tin nhắn của bạn…",
      "sentSuccessfully": "Đã gửi thành công",
      "statusSent": "Đã gửi",
      "statusReceived": "Đã nhận",
      "yesterday": "Hôm qua",
      "writeInfo": "One Million Secrets là nơi để bạn chia sẻ bí mật với thế giới mà không lo bị phán xét, hoặc đơn giản là gửi một lời chúc tốt đẹp đến một người lạ. Sẽ có một người thật đọc tin nhắn của bạn, vì vậy hãy tử tế và tôn trọng.\n\nTin nhắn của bạn được gửi đến một người ngẫu nhiên, không kèm tên bạn. One Million Secrets có thể xem để đảm bảo an toàn. Người nhận có thể chia sẻ nó, vì vậy đừng đưa bất cứ thông tin nào nhận diện bạn hoặc người khác.\n\nNgười nhận có thể báo cáo tin nhắn của bạn nếu họ cảm thấy không được tôn trọng hoặc không an toàn. Các báo cáo có thể khiến tài khoản của bạn bị cấm trong một thời gian, và bị báo cáo nhiều lần có thể dẫn đến bị cấm vĩnh viễn.",
      "creditsInfo": "Tín dụng không bao giờ hết hạn. 1 tín dụng đổi được 1 lượt gửi hoặc 1 lượt nhận thêm. Mỗi quảng cáo được 1 tín dụng, tối đa 3 quảng cáo mỗi ngày.",
      "emptyInbox": "Chưa có tin nhắn. Tin nhắn đến ngẫu nhiên, nên không có giờ cố định.",
      "emptySent": "Tin nhắn bạn viết sẽ hiện ở đây, kèm trạng thái.",
      "aboutWrite": "Giới thiệu: Viết",
      "aboutCredits": "Giới thiệu: Tín dụng",
      "creditOne": "tín dụng",
      "creditMany": "tín dụng",
      "streakOne": "Chuỗi ngày: {count} ngày",
      "streakMany": "Chuỗi ngày: {count} ngày",
      "simLabel": "Bản xem trước tương tác của ứng dụng 1Million Secrets trên iPhone",
      "tabs": "Các thẻ",
      "placeholder": "Viết một bí mật, hoặc một lời tử tế cho người lạ…",
      "demoNote": "Đây là bản xem trước, nên không có gì rời khỏi trình duyệt của bạn.",
      "previewEarned": "Xem trước: bạn nhận được 1 tín dụng. Trong ứng dụng, một video quảng cáo ngắn sẽ phát trước.",
      "previewBuy": "Xem trước: tín dụng được mua trong ứng dụng qua App Store hoặc Google Play.",
      "inboxSamples": [
        "Cuối cùng mình cũng nói với mẹ rằng mình tự hào về mẹ. Mẹ khóc, rồi mình cũng khóc. Ai đang đọc dòng này: nếu có thể, hãy gọi cho mẹ bạn.",
        "Hôm nay mình ăn trưa một mình trong xe và đó là hai mươi phút tuyệt nhất trong tuần. Nghỉ ngơi là điều được phép.",
        "Mình vẫn giữ một tin nhắn thoại của ông. Mình mở nghe vào những ngày quên mất mình là ai.",
        "Ở chỗ làm không ai biết mình đang học piano ở tuổi 41. Đã tập được ba bài. Vẫn dở tệ. Vẫn vui.",
        "Gửi người lạ đang đọc dòng này: bạn đang làm tốt hơn bạn nghĩ đấy. Thật đó.",
        "Mình đã nhận công việc ở tận bên kia đất nước. Sợ. Háo hức. Chủ yếu là sợ."
      ],
      "sentSamples": [
        "Có những ngày mình giả vờ bận để không ai hỏi mình thế nào. Hôm nay mình thật sự ổn, và mình muốn ai đó biết điều đó.",
        "Mùa xuân này mình gieo cà chua từ hạt. Bốn mươi cây. Mình không biết phải làm gì với bốn mươi cây cà chua.",
        "Tuần trước mình đã tha thứ cho anh trai. Mình chưa bao giờ nói với anh. Mình chỉ cảm thấy nó trôi đi.",
        "Nếu bạn đọc dòng này vào một ngày khó khăn, hãy uống chút nước và mở cửa sổ. Những điều nhỏ bé cũng có ý nghĩa."
      ]
    },
    "ja": {
      "aboutMessageTitle": "このメッセージについて",
      "aboutMessageBody": "返信はできず、既読かどうかも送信者には伝わりません。",
      "hideMessageTitle": "このメッセージを非表示にしますか？",
      "hideReceivedBody": "すべての端末の受信箱から削除され、元に戻すことはできません。",
      "blockTitle": "この送信者をブロックしますか？",
      "blockBody": "この送信者からのメッセージは今後届かなくなります。相手には通知されず、相手が誰なのかもわからないままです。",
      "blocked": "この送信者からのメッセージは今後届きません。相手には通知されません。",
      "reportDone": "ありがとうございます。報告を受け付けました。",
      "removeAllTitle": "すべてのテキストを削除しますか？",
      "removeAllBody": "書いた内容がすべて消去されます。",
      "useCreditTitle": "1クレジットを使いますか？",
      "useCreditBody": "無料送信はまだ利用できないため、この送信には1クレジットかかります。残りは {left} になります。",
      "nextFreeSend": "次の無料送信は {time} です。今すぐ送信するには、クレジットを購入するか広告を見てクレジットを獲得してください。",
      "adDailyLimit": "本日のリワード広告3本に達しました。{time} 以降にまた視聴できます。",
      "inbox": "受信箱",
      "sent": "送信済み",
      "account": "アカウント",
      "write": "書く",
      "close": "閉じる",
      "yourMessage": "あなたのメッセージ",
      "removeAllText": "すべてのテキストを削除",
      "copyAllText": "すべてのテキストをコピー",
      "removeRedWords": "送信するには赤い単語を削除してください。",
      "credits": "クレジット",
      "buy10": "10個購入",
      "watchAd": "広告を見る",
      "syncPurchases": "購入を同期",
      "accountStatus": "アカウントの状態",
      "goodStanding": "良好",
      "settings": "設定",
      "preferences": "環境設定",
      "removeAds": "広告を削除",
      "oneTimePurchase": "買い切り",
      "back": "戻る",
      "moreActions": "その他の操作",
      "cancel": "キャンセル",
      "hide": "非表示",
      "report": "報告",
      "reported": "報告済み",
      "blockSender": "送信者をブロック",
      "block": "ブロック",
      "removeAll": "すべて削除",
      "textRemoved": "テキストを削除しました",
      "undo": "元に戻す",
      "copiedToClipboard": "クリップボードにコピーしました",
      "sendFree": "無料で送信",
      "sendForCredit": "1クレジットで送信",
      "sendingYourMessage": "メッセージを送信中…",
      "sentSuccessfully": "送信しました",
      "statusSent": "送信済み",
      "statusReceived": "受信済み",
      "yesterday": "昨日",
      "writeInfo": "One Million Secrets は、批判される心配なく秘密を世界に打ち明けたり、見知らぬ誰かに優しい言葉を送ったりできる場所です。実際に誰かがあなたのメッセージを読むので、思いやりと敬意を忘れずに。\n\nメッセージはあなたの名前なしで、ランダムな1人に届きます。安全のため、One Million Secrets は内容を確認できます。受け取った人はそれを共有できるため、あなたや他の人を特定できる情報は含めないでください。\n\n受け取った人は、尊重されていない、または安全でないと感じた場合、あなたのメッセージを報告できます。報告によりアカウントが一定期間利用停止になることがあり、報告が重なると永久停止になる場合があります。",
      "creditsInfo": "クレジットに有効期限はありません。1クレジットで送信または受信を1回追加できます。広告1本につき1クレジット、1日最大3本まで。",
      "emptyInbox": "まだメッセージはありません。メッセージはランダムに届くため、決まった時間はありません。",
      "emptySent": "書いたメッセージはステータスとともにここに表示されます。",
      "aboutWrite": "「書く」について",
      "aboutCredits": "「クレジット」について",
      "creditOne": "クレジット",
      "creditMany": "クレジット",
      "streakOne": "連続記録：{count}日",
      "streakMany": "連続記録：{count}日",
      "simLabel": "1Million Secrets iPhoneアプリのインタラクティブプレビュー",
      "tabs": "タブ",
      "placeholder": "秘密を、または見知らぬ誰かへの優しい言葉を書いてください…",
      "demoNote": "これはプレビューなので、何もブラウザの外に送信されません。",
      "previewEarned": "プレビュー：1クレジットを獲得しました。アプリでは、先に短い動画広告が再生されます。",
      "previewBuy": "プレビュー：クレジットはアプリ内で App Store または Google Play を通じて購入します。",
      "inboxSamples": [
        "やっと母に「誇りに思ってる」と伝えました。母が泣いて、それから私も泣きました。これを読んでいるあなたへ：できるなら、お母さんに電話してあげて。",
        "今日は車の中でひとりでお昼を食べました。今週いちばん幸せな20分でした。休んでもいいんです。",
        "祖父の留守電メッセージを今も残しています。自分が誰なのかわからなくなった日に、それを聴きます。",
        "41歳でピアノを習っていることを、職場の誰も知りません。弾ける曲は3曲。まだ下手です。でも楽しいです。",
        "これを読んでいる見知らぬあなたへ：あなたは自分で思っているよりずっとよくやっています。本当に。",
        "国の反対側での仕事を引き受けました。怖い。わくわくする。でもやっぱり怖い。"
      ],
      "sentSamples": [
        "誰にも調子を聞かれないように、忙しいふりをする日があります。でも今日は本当に大丈夫で、それを誰かに知ってほしかった。",
        "この春、種からトマトを育てました。40株も。40株のトマトをどうしたらいいのか、まったくわかりません。",
        "先週、兄を許しました。本人には言っていません。ただ、わだかまりが消えていくのを感じました。",
        "つらい日にこれを読んでいるなら、水を飲んで、窓を開けてみて。小さなことが大切です。"
      ]
    },
    "de": {
      "aboutMessageTitle": "Über diese Nachricht",
      "aboutMessageBody": "Du kannst nicht antworten, und der Absender erfährt nicht, ob du sie gelesen hast.",
      "hideMessageTitle": "Diese Nachricht ausblenden?",
      "hideReceivedBody": "Sie wird auf all deinen Geräten aus deinem Posteingang entfernt und kann nicht wiederhergestellt werden.",
      "blockTitle": "Diesen Absender blockieren?",
      "blockBody": "Du erhältst keine Nachrichten mehr von diesem Absender. Er wird nicht benachrichtigt, und du erfährst weiterhin nicht, wer es ist.",
      "blocked": "Du erhältst keine Nachrichten mehr von diesem Absender. Er wird nicht benachrichtigt.",
      "reportDone": "Danke. Deine Meldung ist eingegangen.",
      "removeAllTitle": "Gesamten Text entfernen?",
      "removeAllBody": "Damit wird alles gelöscht, was du geschrieben hast.",
      "useCreditTitle": "1 Credit verwenden?",
      "useCreditBody": "Dein kostenloser Versand ist noch nicht verfügbar, daher kostet dieser Versand 1 Credit. Danach hast du noch {left}.",
      "nextFreeSend": "Dein nächster kostenloser Versand: {time}. Kauf Credits oder sieh dir Werbung an, um Credits zu verdienen und jetzt zu senden.",
      "adDailyLimit": "Du hast heute bereits 3 Werbungen mit Belohnung angesehen. Weitere gibt es nach {time}.",
      "inbox": "Posteingang",
      "sent": "Gesendet",
      "account": "Konto",
      "write": "Schreiben",
      "close": "Schließen",
      "yourMessage": "Deine Nachricht",
      "removeAllText": "Gesamten Text entfernen",
      "copyAllText": "Gesamten Text kopieren",
      "removeRedWords": "Entferne die rot markierten Wörter, um zu senden.",
      "credits": "Credits",
      "buy10": "10 kaufen",
      "watchAd": "Werbung ansehen",
      "syncPurchases": "Käufe synchronisieren",
      "accountStatus": "Kontostatus",
      "goodStanding": "Einwandfrei",
      "settings": "Einstellungen",
      "preferences": "Präferenzen",
      "removeAds": "Werbung entfernen",
      "oneTimePurchase": "Einmaliger Kauf",
      "back": "Zurück",
      "moreActions": "Weitere Aktionen",
      "cancel": "Abbrechen",
      "hide": "Ausblenden",
      "report": "Melden",
      "reported": "Gemeldet",
      "blockSender": "Absender blockieren",
      "block": "Blockieren",
      "removeAll": "Alles entfernen",
      "textRemoved": "Text entfernt",
      "undo": "Rückgängig",
      "copiedToClipboard": "In die Zwischenablage kopiert",
      "sendFree": "Kostenlos senden",
      "sendForCredit": "Für 1 Credit senden",
      "sendingYourMessage": "Deine Nachricht wird gesendet…",
      "sentSuccessfully": "Erfolgreich gesendet",
      "statusSent": "Gesendet",
      "statusReceived": "Empfangen",
      "yesterday": "Gestern",
      "writeInfo": "One Million Secrets ist ein Ort, an dem du ein Geheimnis mit der Welt teilen kannst, ohne Angst, verurteilt zu werden, oder einfach einem fremden Menschen ein paar liebe Worte schickst. Ein echter Mensch liest deine Nachricht, also sei freundlich und respektvoll.\n\nDeine Nachricht geht ohne deinen Namen an eine zufällige Person. One Million Secrets kann sie aus Sicherheitsgründen einsehen. Wer sie erhält, kann sie teilen. Schreib also nichts, was dich oder andere identifiziert.\n\nWer deine Nachricht erhält, kann sie melden, wenn er oder sie sich nicht respektiert oder nicht sicher fühlt. Meldungen können dazu führen, dass dein Konto für eine gewisse Zeit gesperrt wird, und wiederholte Meldungen können zu einer dauerhaften Sperre führen.",
      "creditsInfo": "Credits verfallen nie. 1 Credit ergibt 1 zusätzlichen Versand oder 1 zusätzlichen Empfang. Jede Werbung bringt 1 Credit, bis zu 3 pro Tag.",
      "emptyInbox": "Noch keine Nachrichten. Nachrichten kommen zufällig an, es gibt also keine feste Zeit.",
      "emptySent": "Hier erscheinen deine geschriebenen Nachrichten mit ihrem Status.",
      "aboutWrite": "Info: Schreiben",
      "aboutCredits": "Info: Credits",
      "creditOne": "Credit",
      "creditMany": "Credits",
      "streakOne": "Tagesserie: {count} Tag",
      "streakMany": "Tagesserie: {count} Tage",
      "simLabel": "Interaktive Vorschau der 1Million Secrets-iPhone-App",
      "tabs": "Tabs",
      "placeholder": "Schreib ein Geheimnis oder ein paar liebe Worte für einen fremden Menschen…",
      "demoNote": "Das ist eine Vorschau, also verlässt nichts deinen Browser.",
      "previewEarned": "Vorschau: Du hast 1 Credit verdient. In der App läuft vorher ein kurzes Werbevideo.",
      "previewBuy": "Vorschau: Credits werden in der App über den App Store oder Google Play gekauft.",
      "inboxSamples": [
        "Ich habe meiner Mutter endlich gesagt, dass ich stolz auf sie bin. Sie hat geweint, dann habe ich geweint. Wer auch immer das liest: Ruf deine an, wenn du kannst.",
        "Heute habe ich allein im Auto zu Mittag gegessen, und es waren die besten zwanzig Minuten meiner Woche. Pausen sind erlaubt.",
        "Ich habe immer noch eine Sprachnachricht von meinem Opa. Ich höre sie mir an den Tagen an, an denen ich vergesse, wer ich bin.",
        "Niemand bei der Arbeit weiß, dass ich mit 41 Klavier lerne. Drei Stücke kann ich schon. Immer noch schlecht. Immer noch glücklich.",
        "An den fremden Menschen, der das liest: Du machst das besser, als du denkst. Wirklich.",
        "Ich habe den Job am anderen Ende des Landes zugesagt. Verängstigt. Aufgeregt. Vor allem verängstigt."
      ],
      "sentSamples": [
        "An manchen Tagen tue ich so, als wäre ich beschäftigt, damit niemand fragt, wie es mir geht. Heute geht es mir tatsächlich gut, und ich wollte, dass es jemand weiß.",
        "Ich habe diesen Frühling Tomaten aus Samen gezogen. Vierzig Stück. Ich habe keine Ahnung, was ich mit vierzig Tomatenpflanzen machen soll.",
        "Ich habe meinem Bruder letzte Woche verziehen. Ich habe es ihm nie gesagt. Ich habe nur gespürt, wie es losließ.",
        "Wenn du das an einem schweren Tag liest: Trink etwas Wasser und öffne ein Fenster. Kleine Dinge zählen."
      ]
    }
  }/*END STRINGS*/;
  var LOCALES = { en: "en-US", fr: "fr-FR", es: "es-ES", zh: "zh-CN", vi: "vi-VN", ja: "ja-JP", de: "de-DE" };

  var stop = boot(first, window.OMS_LANG || "en");
  document.addEventListener("oms:lang", function (e) {
    stop();
    var fresh = first.cloneNode(false);
    first.replaceWith(fresh);
    first = fresh;
    stop = boot(fresh, e.detail);
  });

  function boot(root, lang) {
    var APP = "assets/app/";
    var L = STRINGS[lang] || STRINGS.en, LOCALE = LOCALES[lang] || "en-US";
    function fmt(s, vars) { return s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k]; }); }
    function creditUnit(n) { return n === 1 || (lang === "fr" && n === 0) ? L.creditOne : L.creditMany; }
    function statusLabel(s) { return s === "received" ? L.statusReceived : L.statusSent; }
    var DEMO_NOTE = L.demoNote;
    root.setAttribute("aria-label", L.simLabel);

    var T = L; // popover and dialog text is looked up by key (data-key="writeInfo", ...)
    function useCreditBody(left) { return fmt(L.useCreditBody, { left: left }); }
    function nextFreeSend(time) { return fmt(L.nextFreeSend, { time: time }); }

    // ---------- Content filter (port of shared/ContentFilter.kt; contact patterns and a subset of terms) ----------
    var FILTER = {
      suffixes: ["s", "es", "ed", "er", "ers", "ing"],
      terms: [
        "fuck", "fuk", "fuckin", "fck", "fcking", "phuck", "motherfucker", "motherfucking", "mofo", "wtf", "stfu", "gtfo",
        "shit", "shitty", "shite", "bullshit", "horseshit", "shithead", "shithole", "ass", "arse", "asshole", "arsehole",
        "dumbass", "jackass", "bitch", "bitchy", "bastard", "cunt", "twat", "wanker", "prick", "dick", "dickhead", "douche",
        "douchebag", "piss", "bollocks", "slut", "whore", "skank", "scumbag", "dipshit", "goddamn", "damnit",
        "sex", "sexy", "sexting", "porn", "porno", "nude", "nudes", "naked", "horny", "boobs", "tits", "pussy", "penis",
        "cock", "dildo", "onlyfans", "nsfw", "xxx", "hentai", "fetish",
        "kill", "shoot", "stab", "bomb", "murder", "rape", "rapist", "behead", "massacre", "terrorist",
        "suicide", "suicidal", "kys", "kill yourself", "kill myself", "self harm", "selfharm", "end my life", "end your life", "cut myself",
        "minor", "underage", "child", "children", "kid", "pedo", "pedophile", "loli", "jailbait",
        "bitcoin", "crypto", "wire transfer", "gift card", "investment opportunity"
      ],
      patterns: [
        "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}",
        "(?:\\+?\\d[\\s().-]*){9,}\\d",
        "\\b(?:https?://|www\\.)\\S+",
        "\\b[a-z0-9-]+\\.(?:com|net|org|io|me|app|ly|gg)\\b",
        "(?:^|\\s)@[A-Za-z0-9_.]{3,}",
        "\\b(?:snap(?:chat)?|insta(?:gram)?|telegram|whatsapp|discord|kik)\\b\\s*[:\\-]?\\s*\\S+"
      ]
    };
    var LEET = { "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s" };
    var singles = {}, phrases = [];
    FILTER.terms.forEach(function (term) {
      var words = term.toLowerCase().split(" ").filter(Boolean);
      if (words.length === 1) singles[words[0]] = true; else phrases.push(words);
    });
    var patterns = FILTER.patterns.map(function (p) { return new RegExp(p, "gi"); });
    function isLetter(c) { return /[A-Za-z]/.test(c); }
    function isWordChar(c) { return /[A-Za-z0-9@$]/.test(c); }
    function tokenize(text) {
      var tokens = [], i = 0;
      while (i < text.length) {
        if (!isWordChar(text[i])) { i++; continue; }
        var start = i;
        while (i < text.length && isWordChar(text[i])) i++;
        var raw = text.slice(start, i), hasLetter = /[A-Za-z]/.test(raw), word = "";
        for (var k = 0; k < raw.length; k++) {
          var c = raw[k].toLowerCase();
          word += hasLetter && LEET[c] ? LEET[c] : c;
        }
        tokens.push({ start: start, end: i, word: word });
      }
      return tokens;
    }
    function matchesWord(token, word) {
      return token === word || FILTER.suffixes.some(function (s) { return token === word + s; });
    }
    function isSingle(token) {
      if (singles[token]) return true;
      return FILTER.suffixes.some(function (s) {
        return token.length > s.length && token.slice(-s.length) === s && singles[token.slice(0, -s.length)];
      });
    }
    function checkText(text) {
      var found = [], tokens = tokenize(text);
      tokens.forEach(function (token, index) {
        if (isSingle(token.word)) found.push([token.start, token.end]);
        phrases.forEach(function (words) {
          var last = index + words.length - 1;
          if (last >= tokens.length) return;
          var ok = words.every(function (w, o) {
            var cand = tokens[index + o].word;
            return o === words.length - 1 ? matchesWord(cand, w) : cand === w;
          });
          if (ok) found.push([token.start, tokens[last].end]);
        });
      });
      patterns.forEach(function (re) {
        re.lastIndex = 0;
        var m;
        while ((m = re.exec(text))) {
          var start = m.index, end = m.index + m[0].length;
          while (start < end && /\s/.test(text[start])) start++;
          if (start < end) found.push([start, end]);
          if (m[0].length === 0) re.lastIndex++;
        }
      });
      found.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      var merged = [];
      found.forEach(function (r) {
        var prev = merged[merged.length - 1];
        if (prev && r[0] <= prev[1]) prev[1] = Math.max(prev[1], r[1]); else merged.push([r[0], r[1]]);
      });
      return merged;
    }

    // ---------- Formatting (port of Formats.swift) ----------
    function dayStart(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
    function timeOf(d) { return d.toLocaleTimeString(LOCALE, { hour: "numeric", minute: "2-digit" }); }
    function listTime(d) {
      var now = new Date(), days = Math.round((dayStart(now) - dayStart(d)) / 864e5);
      if (days <= 0) return timeOf(d);
      if (days === 1) return L.yesterday;
      if (days < 7) return d.toLocaleDateString(LOCALE, { weekday: "short" });
      if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString(LOCALE, { month: "short", day: "numeric" });
      return d.toLocaleDateString(LOCALE, { month: "short", day: "numeric", year: "numeric" });
    }
    function dateTime(d) {
      if (lang !== "en") return d.toLocaleString(LOCALE, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
      return d.toLocaleDateString(LOCALE, { month: "short", day: "numeric", year: "numeric" }) + " at " + timeOf(d);
    }
    function ago(minutes) { return new Date(Date.now() - minutes * 60000); }
    function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
    function codePoints(s) { return Array.from(s.trim()).length; }

    // ---------- Icons (SF Symbols look-alikes) ----------
    function svg(body, vb, extra) {
      return '<svg viewBox="' + (vb || "0 0 24 24") + '" aria-hidden="true" focusable="false"' + (extra || "") + ">" + body + "</svg>";
    }
    var S = ' fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    var TRAY = "M3 13.5 5.6 5.4A2 2 0 0 1 7.5 4h9a2 2 0 0 1 1.9 1.4L21 13.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z";
    var PLANE = "M21.5 2.5 2.8 10.2a.6.6 0 0 0 0 1.1l7 2.9 2.9 7a.6.6 0 0 0 1.1 0z";
    var I = {
      trayOff: svg('<path d="' + TRAY + '"/><path d="M3 13.5h5a4 4 0 0 0 8 0h5"/>', 0, S),
      trayOn: svg('<path fill="currentColor" d="' + TRAY + '"/><path d="M3.6 13.5H8a4 4 0 0 0 8 0h4.4" fill="none" stroke="#f9f9f9" stroke-width="1.6"/>'),
      planeOff: svg('<path d="' + PLANE + '"/><path d="M21.5 2.5 9.8 14.2"/>', 0, S),
      planeOn: svg('<path fill="currentColor" d="' + PLANE + '"/><path d="M21 3 9.8 14.2" stroke="#f9f9f9" stroke-width="1.5"/>'),
      personOff: svg('<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="9.8" r="3.3"/><path d="M5.8 18.2a8 8 0 0 1 12.4 0"/>', 0, S),
      personOn: svg('<circle cx="12" cy="12" r="10.2" fill="currentColor"/><circle cx="12" cy="9.8" r="3.3" fill="#f9f9f9"/><path d="M5.6 18.6a8.4 8.4 0 0 1 12.8 0A9.2 9.2 0 0 1 12 21.2a9.2 9.2 0 0 1-6.4-2.6z" fill="#f9f9f9"/>'),
      write: svg('<path d="M12 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V12"/><path d="M17.8 3.6a2 2 0 0 1 2.8 2.8L12.3 14.7l-3.7.9.9-3.7z"/>', 0, ' fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"'),
      info: svg('<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7.6" r="1.25" fill="currentColor"/>'),
      xmarkCircle: svg('<circle cx="12" cy="12" r="11" fill="currentColor" opacity=".18"/><path d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>'),
      trash: svg('<path d="M4 6.5h16M9.5 6.5V4.8c0-.5.4-.8.8-.8h3.4c.4 0 .8.3.8.8v1.7M6 6.5l.9 12.6A2 2 0 0 0 8.9 21h6.2a2 2 0 0 0 2-1.9L18 6.5M10 10.5v6M14 10.5v6"/>', 0, S),
      copy: svg('<rect x="8.5" y="8.5" width="11.5" height="12.5" rx="2"/><path d="M15.5 8.5V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h2.5"/>', 0, S),
      planeFill: svg('<path d="' + PLANE + '"/>'),
      flame: svg('<path d="M12 1.5c.6 3.6 5.6 6 5.6 11.6A5.6 5.6 0 0 1 12 18.7a5.6 5.6 0 0 1-5.6-5.6c0-2.8 1.5-4.4 2.7-5.8.2 1.9 1.1 3 2.3 3.5.4-3.1-.1-6.4.6-9.3z"/>', "0 0 24 20"),
      chevronLeft: svg('<path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>', "0 0 12 20"),
      chevronRight: svg('<path d="M1.5 1.5 6.5 7l-5 5.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>', "0 0 8 14"),
      ellipsis: svg('<circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.8" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="16.2" cy="12" r="1.3" fill="currentColor"/>'),
      sparkles: svg('<path fill="currentColor" d="M10 3l1.6 4.4L16 9l-4.4 1.6L10 15l-1.6-4.4L4 9l4.4-1.6zM17.5 13l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/>', 0, ' width="14" height="14"'),
      cart: svg('<path d="M2.5 3.5h2.6l2.3 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 7H6.2"/><circle cx="9.5" cy="20" r="1.5" fill="currentColor"/><circle cx="17.5" cy="20" r="1.5" fill="currentColor"/>', 0, ' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'),
      play: svg('<path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/>'),
      sync: svg('<path d="M20 11a8 8 0 0 0-14.3-4.6M4 13a8 8 0 0 0 14.3 4.6"/><path d="M5.5 2.8v3.8h3.8M18.5 21.2v-3.8h-3.8"/>', 0, S),
      shield: svg('<path fill="currentColor" d="M12 2 4 5v6.2c0 5 3.4 9.4 8 10.8 4.6-1.4 8-5.8 8-10.8V5z"/><path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'),
      gear: svg('<path fill="currentColor" fill-rule="evenodd" d="M10.3 2h3.4l.5 2.6 1.6.9 2.5-.9 1.7 2.9-2 1.7v1.6l2 1.7-1.7 2.9-2.5-.9-1.6.9-.5 2.6h-3.4l-.5-2.6-1.6-.9-2.5.9-1.7-2.9 2-1.7v-1.6l-2-1.7 1.7-2.9 2.5.9 1.6-.9zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" transform="translate(0 1)"/>'),
      noAds: svg('<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M7 15l1.6-5h.8l1.6 5M7.6 13.4h2.8M13 10h1.6a2.5 2.5 0 0 1 0 5H13z"/><path d="M3.5 3.5l17 17"/>', 0, S),
      eyeSlash: svg('<path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6z"/><circle cx="12" cy="12" r="2.8"/><path d="M4 3.5 20 20.5"/>', 0, S),
      flag: svg('<path d="M5 21V4M5 4h11.5l-2 4 2 4H5"/>', 0, S),
      flagFill: svg('<path d="M5 21V4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path fill="currentColor" d="M5 3.2h12l-2.2 4.4 2.2 4.4H5z"/>'),
      hand: svg('<path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11M11 10.5V4a1.5 1.5 0 0 1 3 0v6.5M14 10.5V5.5a1.5 1.5 0 0 1 3 0V14c0 4-2.5 7-6.5 7-2.5 0-4-1.2-5.4-3.3L3.4 15a1.6 1.6 0 0 1 2.6-1.8L8 15"/>', 0, S),
      signal: svg('<rect x="0" y="7" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="6" rx="1"/><rect x="10" y="2.5" width="3" height="8.5" rx="1"/><rect x="15" y="0" width="3" height="11" rx="1"/>', "0 0 18 11", ' width="18" height="11" fill="currentColor"'),
      wifi: svg('<path d="M8 2.2c2.5 0 4.8 1 6.5 2.6l1.1-1.1A10.8 10.8 0 0 0 8 .6 10.8 10.8 0 0 0 .4 3.7l1.1 1.1A9.2 9.2 0 0 1 8 2.2zm0 3.4c1.6 0 3 .6 4.1 1.6l1.1-1.1A7.5 7.5 0 0 0 8 4a7.5 7.5 0 0 0-5.2 2.1l1.1 1.1c1.1-1 2.5-1.6 4.1-1.6zm0 3.4c.7 0 1.3.3 1.8.7L8 11.5 6.2 9.7c.5-.4 1.1-.7 1.8-.7z"/>', "0 0 16 12", ' width="16" height="12" fill="currentColor"'),
      battery: svg('<rect x=".5" y=".5" width="24" height="12" rx="3.8" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="21" height="9" rx="2.5" fill="currentColor"/><path d="M26 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45"/>', "0 0 28 13", ' width="28" height="13"')
    };

    // ---------- Demo data ----------
    var AVATARS = ["avatar_042", "avatar_123", "avatar_000", "avatar_160", "avatar_088", "avatar_017", "avatar_199"];
    var state = {
      tab: "inbox",
      freeAvailable: true,
      balance: 3,
      adsToday: 0,
      streak: 7,
      sentToday: false,
      draft: "",
      inbox: [
        { text: L.inboxSamples[0], at: ago(25), unread: true },
        { text: L.inboxSamples[1], at: ago(130), unread: true },
        { text: L.inboxSamples[2], at: ago(60 * 26) },
        { text: L.inboxSamples[3], at: ago(60 * 24 * 3) },
        { text: L.inboxSamples[4], at: ago(60 * 24 * 5) },
        { text: L.inboxSamples[5], at: ago(60 * 24 * 12) }
      ],
      sent: [
        { text: L.sentSamples[0], at: ago(60 * 20), status: "received" },
        { text: L.sentSamples[1], at: ago(60 * 24 * 2 + 40), status: "received" },
        { text: L.sentSamples[2], at: ago(60 * 24 * 4), status: "received" },
        { text: L.sentSamples[3], at: ago(60 * 24 * 9), status: "received" }
      ]
    };
    state.inbox.forEach(function (m, i) { m.id = "r" + i; m.avatar = AVATARS[i % AVATARS.length]; });
    state.sent.forEach(function (m, i) { m.id = "s" + i; });
    var nextId = 100;

    // ---------- Markup ----------
    function tabButton(name, label, off, on) {
      return '<button type="button" data-action="tab" data-tab="' + name + '" aria-label="' + label + '"><span class="off">' + off + '</span><span class="on">' + on + "</span>" +
        (name === "inbox" ? '<span class="oms-badge" data-badge hidden></span>' : "") + "</button>";
    }
    var LOGO = '<img class="oms-logo" src="' + APP + 'logo.png" alt="One Million Secrets" width="300" height="44">';
    root.innerHTML =
      '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="oms-flame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffcc00"/><stop offset=".5" stop-color="#ff9500"/><stop offset="1" stop-color="#ff3b30"/></linearGradient></defs></svg>' +
      '<div class="oms-device"><div class="oms-screen" data-screen>' +
        '<div class="oms-app" data-app>' +
          '<section class="oms-tab" data-panel="inbox"><div class="oms-page is-list"><div class="oms-page-inner">' + LOGO +
            '<div class="oms-title-row"><h3 class="oms-title">' + esc(L.inbox) + '</h3><span class="oms-streak" data-streak></span></div>' +
            '<div class="oms-list" data-inbox-list></div></div></div><div class="oms-page is-detail" data-inbox-detail></div></section>' +
          '<section class="oms-tab" data-panel="sent"><div class="oms-page is-list"><div class="oms-page-inner">' + LOGO +
            '<h3 class="oms-title oms-page-title">' + esc(L.sent) + '</h3><div class="oms-list" data-sent-list></div></div></div><div class="oms-page is-detail" data-sent-detail></div></section>' +
          '<section class="oms-tab" data-panel="account"><div class="oms-page is-list"><div class="oms-page-inner" data-account></div></div></section>' +
          '<button type="button" class="oms-write-fab" data-action="open-write" aria-label="' + esc(L.write) + '">' + I.write + "</button>" +
          '<nav class="oms-tabbar" aria-label="' + esc(L.tabs) + '"><span class="oms-tab-indicator" data-indicator aria-hidden="true"></span>' + tabButton("inbox", esc(L.inbox), I.trayOff, I.trayOn) + tabButton("sent", esc(L.sent), I.planeOff, I.planeOn) +
            tabButton("account", esc(L.account), I.personOff, I.personOn) + "</nav>" +
        "</div>" +
        '<div class="oms-dim" data-action="close-write"></div>' +
        '<div class="oms-sheet" data-sheet role="dialog" aria-label="' + esc(L.write) + '"><div class="oms-sheet-inner">' +
          '<div class="oms-write-head"><h3 class="oms-title">' + esc(L.write) + '</h3>' +
            '<button type="button" class="oms-info" data-action="popover" data-title="' + esc(L.write) + '" data-key="writeInfo" aria-label="' + esc(L.aboutWrite) + '">' + I.info + "</button>" +
            '<button type="button" class="oms-close" data-action="close-write" aria-label="' + esc(L.close) + '">' + I.xmarkCircle + "</button></div>" +
          '<div class="oms-editor-wrap"><div class="oms-editor" data-editor role="textbox" aria-multiline="true" aria-label="' + esc(L.yourMessage) + '" spellcheck="false" data-placeholder="' + esc(L.placeholder) + '"></div><div data-notice></div></div>' +
          '<div class="oms-tools"><button type="button" class="oms-tool" data-action="clear" aria-label="' + esc(L.removeAllText) + '">' + I.trash + "</button>" +
            '<button type="button" class="oms-tool" data-action="copy" aria-label="' + esc(L.copyAllText) + '">' + I.copy + "</button>" +
            '<span class="oms-counter" data-counter>0 / 2000</span></div>' +
          '<p class="oms-warn" data-warn hidden>' + esc(L.removeRedWords) + '</p>' +
          '<div data-send-area></div>' +
        "</div></div>" +
        '<div class="oms-cover" data-cover aria-live="polite">' + LOGO + '<div class="oms-cover-body" data-cover-body></div></div>' +
        '<div class="oms-status" aria-hidden="true"><span>9:41</span><span class="oms-status-icons">' + I.signal + I.wifi + I.battery + "</span></div>" +
        '<div class="oms-island" aria-hidden="true"></div><div class="oms-home-indicator" aria-hidden="true"></div>' +
        "<div data-overlay></div>" +
      "</div></div>";

    var screen = root.querySelector("[data-screen]");
    var app = root.querySelector("[data-app]");
    var overlay = root.querySelector("[data-overlay]");
    var editor = root.querySelector("[data-editor]");
    function $(sel) { return root.querySelector(sel); }
    // The phone's clipped layers must never scroll (a focused field could otherwise nudge them).
    [screen, app, $("[data-sheet]")].forEach(function (el) {
      el.addEventListener("scroll", function () { el.scrollTop = 0; el.scrollLeft = 0; });
    });

    // ---------- Fit to the page ----------
    function fit() {
      var parent = root.parentElement, cs = getComputedStyle(parent);
      var width = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      root.style.setProperty("--s", Math.max(.5, Math.min(.8, width / 414)).toFixed(3));
    }
    fit();
    window.addEventListener("resize", fit);

    // ---------- Rendering ----------
    function unreadCount() { return state.inbox.filter(function (m) { return m.unread; }).length; }

    function renderTabs() {
      root.querySelectorAll("[data-panel]").forEach(function (p) {
        var name = p.getAttribute("data-panel");
        p.classList.toggle("is-active", name === state.tab);
      });
      root.querySelectorAll(".oms-tabbar [data-tab]").forEach(function (b) {
        var on = b.getAttribute("data-tab") === state.tab;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", on);
      });
      // The glass bubble behind the selected tab slides between tabs, as on iOS 26.
      $("[data-indicator]").style.transform = "translateX(" + (["inbox", "sent", "account"].indexOf(state.tab) * 100) + "%)";
      var badge = $("[data-badge]"), n = unreadCount();
      badge.hidden = n === 0;
      badge.textContent = n > 99 ? "99+" : n;
    }

    function renderStreak() {
      var el = $("[data-streak]");
      el.className = "oms-streak" + (state.sentToday ? " is-active" : "");
      el.innerHTML = I.flame + "<span>" + state.streak + "</span>";
      el.setAttribute("aria-label", fmt(state.streak === 1 ? L.streakOne : L.streakMany, { count: state.streak }));
    }

    function emptyState(kind) {
      return '<p class="oms-caption" style="text-align:center;margin-top:120px;font-size:15px">' +
        esc(kind === "inbox" ? L.emptyInbox : L.emptySent) + "</p>";
    }

    function renderInbox() {
      var list = $("[data-inbox-list]");
      if (!state.inbox.length) { list.innerHTML = emptyState("inbox"); return; }
      list.innerHTML = state.inbox.map(function (m) {
        return '<button type="button" class="oms-row" data-action="open-received" data-id="' + m.id + '">' +
          '<img class="oms-avatar" src="' + APP + "avatars/" + m.avatar + '.png" alt="" width="48" height="48">' +
          '<span class="oms-row-text"><span class="oms-row-msg' + (m.unread ? " is-unread" : "") + '">' + esc(m.text) + "</span>" +
          '<span class="oms-caption">' + listTime(m.at) + "</span></span></button>";
      }).join("");
    }

    function renderSent() {
      var list = $("[data-sent-list]");
      if (!state.sent.length) { list.innerHTML = emptyState("sent"); return; }
      list.innerHTML = state.sent.map(function (m) {
        return '<button type="button" class="oms-row" data-action="open-sent" data-id="' + m.id + '">' +
          '<img class="oms-avatar" src="' + APP + 'avatars/profile_avatar_20.png" alt="" width="48" height="48">' +
          '<span class="oms-row-text"><span class="oms-row-msg">' + esc(m.text) + "</span>" +
          '<span class="oms-caption">' + esc(statusLabel(m.status)) + " · " + listTime(m.at) + "</span></span></button>";
      }).join("");
    }

    function renderAccount() {
      var unit = esc(creditUnit(state.balance));
      $("[data-account]").innerHTML = LOGO +
        '<h3 class="oms-title oms-page-title">' + esc(L.account) + '</h3>' +
        '<div class="oms-credits"><div class="oms-credits-head"><span class="oms-spark">' + I.sparkles + "</span>" + esc(L.credits) +
          '<button type="button" data-action="popover" data-title="' + esc(L.credits) + '" data-key="creditsInfo" aria-label="' + esc(L.aboutCredits) + '" style="color:rgba(255,255,255,.75);width:20px;height:20px">' + I.info + "</button></div>" +
          '<div class="oms-credits-balance"><span class="ghost">' + unit + "</span><strong>" + state.balance + "</strong><span>" + unit + "</span></div>" +
          '<div class="oms-pill-row"><button type="button" class="oms-pill filled" data-action="buy">' + I.cart + esc(L.buy10) + " · $1.99</button>" +
            '<button type="button" class="oms-pill outline" data-action="watch-ad">' + I.play + esc(L.watchAd) + "</button></div>" +
          '<button type="button" class="oms-sync" data-action="demo">' + I.sync + esc(L.syncPurchases) + "</button></div>" +
        '<div class="oms-tiles">' +
          tile(I.shield, esc(L.accountStatus), '<i class="oms-dot"></i>' + esc(L.goodStanding)) +
          tile(I.gear, esc(L.settings), esc(L.preferences)) +
          tile(I.noAds, esc(L.removeAds), esc(L.oneTimePurchase)) +
        "</div>";
    }
    function tile(icon, title, value) {
      return '<button type="button" class="oms-tile" data-action="demo"><span class="oms-tile-icon">' + icon + "</span>" +
        '<span class="oms-tile-text"><b>' + title + "</b><span>" + value + '</span></span><span class="oms-chev">' + I.chevronRight + "</span></button>";
    }

    function renderAll() { renderTabs(); renderStreak(); renderInbox(); renderSent(); renderAccount(); }

    // ---------- Navigation ----------
    function panel(name) { return root.querySelector('[data-panel="' + name + '"]'); }
    function pop(name) { panel(name).classList.remove("is-pushed"); }
    function openReceived(id) {
      var m = find(state.inbox, id);
      if (!m) return;
      if (m.unread) { m.unread = false; renderInbox(); renderTabs(); }
      var detail = $("[data-inbox-detail]");
      detail.innerHTML = '<div class="oms-page-inner">' + LOGO +
        '<button type="button" class="oms-back" data-action="back" data-tab="inbox">' + I.chevronLeft + esc(L.back) + "</button>" +
        '<div class="oms-detail-tools"><button type="button" data-action="popover" data-title="' + esc(L.aboutMessageTitle) + '" data-key="aboutMessageBody" aria-label="' + esc(L.aboutMessageTitle) + '" style="color:rgba(60,60,67,.6);width:22px;height:22px">' + I.info + "</button>" +
          '<button type="button" data-action="menu" data-id="' + m.id + '" aria-label="' + esc(L.moreActions) + '" style="width:26px;height:26px">' + I.ellipsis + "</button></div>" +
        '<div class="oms-received-box"><p>' + esc(m.text) + '</p><span class="oms-caption">' + dateTime(m.at) + "</span></div></div>";
      detail.scrollTop = 0;
      panel("inbox").classList.add("is-pushed");
    }
    function openSent(id) {
      var m = find(state.sent, id);
      if (!m) return;
      var detail = $("[data-sent-detail]");
      detail.innerHTML = '<div class="oms-page-inner">' + LOGO +
        '<button type="button" class="oms-back" data-action="back" data-tab="sent">' + I.chevronLeft + esc(L.back) + "</button>" +
        '<div class="oms-letter"><p>' + esc(m.text) + "</p><small>" + esc(statusLabel(m.status)) + " · " + dateTime(m.at) + "</small></div></div>";
      detail.scrollTop = 0;
      panel("sent").classList.add("is-pushed");
    }
    function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

    // ---------- Overlays: toast, dialog, menu, popover ----------
    var toastTimer;
    function toast(message) {
      clearTimeout(toastTimer);
      overlay.querySelectorAll(".oms-toast").forEach(function (t) { t.remove(); });
      var el = document.createElement("div");
      el.className = "oms-toast";
      el.setAttribute("role", "status");
      el.textContent = message;
      el.addEventListener("click", function () { el.remove(); });
      overlay.appendChild(el);
      toastTimer = setTimeout(function () { el.remove(); }, 4000);
    }
    function closeFloating() { overlay.querySelectorAll(".oms-dialog,.oms-menu,.oms-popover,.oms-scrim").forEach(function (e) { e.remove(); }); }
    function dialog(title, message, actions) {
      closeFloating();
      var el = document.createElement("div");
      el.className = "oms-dialog";
      el.innerHTML = '<div class="oms-dialog-group"><div class="oms-dialog-head"><b>' + esc(title) + "</b><span>" + esc(message) + "</span></div>" +
        actions.map(function (a, i) { return '<button type="button" data-i="' + i + '"' + (a.destructive ? ' class="destructive"' : "") + ">" + esc(a.label) + "</button>"; }).join("") +
        '</div><button type="button" class="oms-dialog-cancel" data-i="-1">' + esc(L.cancel) + "</button>";
      el.addEventListener("click", function (e) {
        var b = e.target.closest("button");
        if (!b && e.target !== el) return;
        el.remove();
        if (b && b.getAttribute("data-i") !== "-1") actions[+b.getAttribute("data-i")].run();
      });
      overlay.appendChild(el);
    }
    // Position of a button inside the phone screen, from layout offsets (ignores slide transitions and page scale).
    function anchor(button) {
      var x = 0, y = 0, el = button;
      while (el && el !== screen) {
        x += el.offsetLeft; y += el.offsetTop;
        var parent = el.offsetParent;
        if (!parent) break;
        x -= parent.scrollLeft; y -= parent.scrollTop;
        el = parent;
      }
      return { left: x, top: y, right: x + button.offsetWidth, bottom: y + button.offsetHeight };
    }
    function scrim() {
      var el = document.createElement("div");
      el.className = "oms-scrim";
      el.addEventListener("click", closeFloating);
      overlay.appendChild(el);
    }
    function popover(button) {
      closeFloating();
      scrim();
      var key = button.getAttribute("data-key"), a = anchor(button);
      var el = document.createElement("div");
      el.className = "oms-popover";
      el.setAttribute("role", "dialog");
      el.innerHTML = "<b>" + esc(button.getAttribute("data-title")) + "</b><p>" + esc(T[key]) + "</p>";
      el.style.left = Math.max(16, Math.min(374 - 300, a.left - 140)) + "px";
      el.style.top = (a.bottom + 8) + "px";
      overlay.appendChild(el);
      var bottom = el.offsetTop + el.offsetHeight;
      if (bottom > 820) el.style.top = Math.max(60, a.top - 8 - el.offsetHeight) + "px";
      el.addEventListener("click", closeFloating);
    }
    function menu(button) {
      closeFloating();
      scrim();
      var id = button.getAttribute("data-id"), m = find(state.inbox, id), a = anchor(button);
      var el = document.createElement("div");
      el.className = "oms-menu";
      el.setAttribute("role", "menu");
      el.innerHTML = '<button type="button" data-m="hide">' + esc(L.hide) + I.eyeSlash + "</button>" +
        (m.reported ? '<button type="button" disabled>' + esc(L.reported) + I.flagFill + "</button>" : '<button type="button" data-m="report">' + esc(L.report) + I.flag + "</button>") +
        '<button type="button" class="destructive" data-m="block">' + esc(L.blockSender) + I.hand + "</button>";
      el.style.left = (a.right - 250) + "px";
      el.style.top = (a.bottom + 6) + "px";
      el.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-m]");
        if (!b) return;
        closeFloating();
        var action = b.getAttribute("data-m");
        if (action === "hide") {
          dialog(T.hideMessageTitle, T.hideReceivedBody, [{ label: L.hide, destructive: true, run: function () {
            state.inbox = state.inbox.filter(function (x) { return x.id !== id; });
            pop("inbox"); renderInbox(); renderTabs();
          } }]);
        } else if (action === "report") {
          m.reported = true;
          toast(T.reportDone);
        } else {
          dialog(T.blockTitle, T.blockBody, [{ label: L.block, destructive: true, run: function () { toast(T.blocked); } }]);
        }
      });
      overlay.appendChild(el);
    }

    // ---------- Write sheet ----------
    var frames = [], framesLoaded = false;
    function preloadFrames() {
      if (framesLoaded) return;
      framesLoaded = true;
      for (var i = 0; i < 120; i++) {
        var img = new Image();
        img.src = APP + "send/send_frame_" + ("00" + i).slice(-3) + ".jpg";
        frames.push(img);
      }
      new Image().src = APP + "send_success.png";
    }
    function openWrite() {
      closeFloating();
      preloadFrames();
      setText(state.draft, false);
      screen.classList.add("is-sheet");
      updateWrite();
    }
    function closeWrite() {
      state.draft = text();
      screen.classList.remove("is-sheet");
      editor.blur();
    }

    // Editable box that shows filter matches in bold red, like HighlightingTextEditor.
    editor.contentEditable = "plaintext-only";
    if (editor.contentEditable !== "plaintext-only") editor.contentEditable = "true";
    var composing = false;
    function text() { return editor.textContent; }
    function caret() {
      var sel = window.getSelection();
      if (!sel.rangeCount || !editor.contains(sel.anchorNode)) return null;
      var range = sel.getRangeAt(0);
      function offset(node, off) {
        var r = document.createRange();
        r.selectNodeContents(editor);
        r.setEnd(node, off);
        return r.toString().length;
      }
      return [offset(range.startContainer, range.startOffset), offset(range.endContainer, range.endOffset)];
    }
    function placeCaret(pos) {
      var walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT), node, left = pos, last = null;
      while ((node = walker.nextNode())) {
        last = node;
        if (left <= node.length) break;
        left -= node.length;
      }
      var range = document.createRange();
      if (node) range.setStart(node, left);
      else if (last) range.setStart(last, last.length);
      else range.setStart(editor, 0);
      range.collapse(true);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    function highlightHtml(value) {
      var ranges = checkText(value), out = "", pos = 0;
      ranges.forEach(function (r) {
        out += esc(value.slice(pos, r[0])) + "<b>" + esc(value.slice(r[0], r[1])) + "</b>";
        pos = r[1];
      });
      out += esc(value.slice(pos));
      if (/\n$/.test(value)) out += "<br>";
      return { html: out, blocked: ranges.length > 0 };
    }
    function setText(value, keepCaret, caretAt) {
      var pos = keepCaret ? (caretAt != null ? caretAt : (caret() || [value.length])[1]) : null;
      var result = highlightHtml(value);
      if (editor.innerHTML !== result.html) editor.innerHTML = result.html;
      if (pos != null && document.activeElement === editor) placeCaret(pos);
      return result.blocked;
    }
    function insertAtCaret(insert) {
      var value = text(), c = caret() || [value.length, value.length];
      setText(value.slice(0, c[0]) + insert + value.slice(c[1]), true, c[0] + insert.length);
      afterEdit();
    }
    editor.addEventListener("beforeinput", function (e) {
      if (e.inputType === "insertParagraph" || e.inputType === "insertLineBreak") { e.preventDefault(); insertAtCaret("\n"); }
      else if (e.inputType === "insertFromPaste" || e.inputType === "insertFromDrop") {
        var data = e.dataTransfer && e.dataTransfer.getData("text/plain");
        if (data != null) { e.preventDefault(); insertAtCaret(data.replace(/\r\n?/g, "\n")); }
      }
    });
    editor.addEventListener("paste", function (e) {
      if (e.defaultPrevented) return;
      e.preventDefault();
      insertAtCaret((e.clipboardData.getData("text/plain") || "").replace(/\r\n?/g, "\n"));
    });
    editor.addEventListener("compositionstart", function () { composing = true; });
    editor.addEventListener("compositionend", function () { composing = false; setText(text(), true); afterEdit(); });
    editor.addEventListener("input", function () {
      if (composing) return;
      setText(text(), true);
      afterEdit();
    });
    function afterEdit() {
      state.draft = text();
      if (text()) clearNotice();
      updateWrite();
    }

    var noticeTimer, removedText = null;
    function notice(html, ms) {
      clearTimeout(noticeTimer);
      $("[data-notice]").innerHTML = '<div class="oms-notice">' + html + "</div>";
      noticeTimer = setTimeout(clearNotice, ms);
    }
    function clearNotice() { clearTimeout(noticeTimer); removedText = null; $("[data-notice]").innerHTML = ""; }

    function quote() {
      if (state.freeAvailable) return "free";
      return state.balance > 0 ? "credit" : "none";
    }
    function nextMidnight() { var d = dayStart(new Date()); d.setDate(d.getDate() + 1); return d; }

    function updateWrite() {
      var value = text(), count = codePoints(value), blocked = checkText(value).length > 0;
      var lengthValid = count >= 1 && count <= 2000, valid = lengthValid && !blocked;
      var counter = $("[data-counter]");
      counter.textContent = count + " / 2000";
      counter.classList.toggle("is-over", !lengthValid && value.length > 0);
      $("[data-warn]").hidden = !blocked;
      root.querySelectorAll(".oms-tool").forEach(function (b) { b.disabled = value.length === 0; });
      var q = quote(), area = $("[data-send-area]");
      if (q === "none") {
        area.innerHTML = '<p class="oms-next-free">' + nextFreeSend(dateTime(nextMidnight())) + "</p>" +
          '<div class="oms-buy-row"><button type="button" class="prominent" data-action="buy">' + I.cart + esc(L.buy10) + " · $1.99</button>" +
          '<button type="button" class="bordered" data-action="watch-ad">' + I.play + esc(L.watchAd) + "</button></div>";
      } else {
        area.innerHTML = '<div class="oms-send-row"><button type="button" class="oms-send" data-action="send"' + (valid ? "" : " disabled") + ">" +
          I.planeFill + esc(q === "free" ? L.sendFree : L.sendForCredit) + "</button></div>";
      }
    }

    // ---------- Sending page ----------
    var frameTimer = null, sendTimers = [];
    function startSending(funding) {
      var message = text().trim();
      editor.blur();
      var body = $("[data-cover-body]");
      body.innerHTML = '<img class="oms-cover-frame" data-frame src="' + frames[0].src + '" alt="" width="350" height="350">' +
        '<span class="oms-cover-label" role="status">' + esc(L.sendingYourMessage) + "</span>";
      screen.classList.add("is-sending");
      var frameEl = body.querySelector("[data-frame]"), start = performance.now();
      frameTimer = setInterval(function () {
        var img = frames[Math.floor((performance.now() - start) / 1000 * 30) % 120];
        if (img.complete && img.naturalWidth) frameEl.src = img.src;
      }, 1000 / 30);
      // Same timing as the app: a random 5 or 6 seconds, then "Sent Successfully" for 3 seconds.
      sendTimers.push(setTimeout(function () {
        clearInterval(frameTimer);
        body.innerHTML = '<img class="oms-cover-success" src="' + APP + 'send_success.png" alt="' + esc(L.sentSuccessfully) + '" width="350" height="350">';
        sendTimers.push(setTimeout(function () { finishSend(message, funding); }, 3000));
      }, Math.random() < .5 ? 5000 : 6000));
    }
    function finishSend(message, funding) {
      if (funding === "free") state.freeAvailable = false; else state.balance -= 1;
      if (!state.sentToday) { state.sentToday = true; state.streak += 1; }
      var item = { id: "s" + nextId++, text: message, at: new Date(), status: "sent" };
      state.sent.unshift(item);
      state.draft = "";
      setText("", false);
      clearNotice();
      screen.classList.remove("is-sheet");
      pop("sent");
      state.tab = "sent";
      renderAll();
      setTimeout(function () { screen.classList.remove("is-sending"); }, 30);
      // In the app, a message stays "Sent" until it reaches someone's inbox.
      sendTimers.push(setTimeout(function () { item.status = "received"; renderSent(); }, 9000));
    }

    // ---------- Events ----------
    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-action]");
      if (!b || !root.contains(b) || b.disabled) return;
      var action = b.getAttribute("data-action");
      switch (action) {
        case "tab":
          var name = b.getAttribute("data-tab");
          if (name === state.tab) { pop(name); panel(name).querySelector(".is-list").scrollTop = 0; }
          state.tab = name;
          renderTabs();
          break;
        case "open-received": openReceived(b.getAttribute("data-id")); break;
        case "open-sent": openSent(b.getAttribute("data-id")); break;
        case "back": pop(b.getAttribute("data-tab")); break;
        case "menu": menu(b); break;
        case "popover": popover(b); break;
        case "open-write": openWrite(); break;
        case "close-write": closeWrite(); break;
        case "clear":
          dialog(T.removeAllTitle, T.removeAllBody, [{ label: L.removeAll, destructive: true, run: function () {
            var old = text();
            setText("", false);
            state.draft = "";
            updateWrite();
            removedText = old;
            notice("<span>" + esc(L.textRemoved) + '</span><button type="button" data-action="undo">' + esc(L.undo) + "</button>", 3000);
          } }]);
          break;
        case "undo":
          if (removedText != null) { setText(removedText, false); state.draft = removedText; clearNotice(); updateWrite(); }
          break;
        case "copy":
          if (navigator.clipboard) navigator.clipboard.writeText(text()).catch(function () {});
          notice("<span>" + esc(L.copiedToClipboard) + "</span>", 1500);
          break;
        case "send":
          var q = quote();
          if (q === "free") startSending("free");
          else if (q === "credit") {
            dialog(T.useCreditTitle, useCreditBody(state.balance - 1), [{ label: L.sendForCredit, run: function () { startSending("credit"); } }]);
          }
          break;
        case "watch-ad":
          if (state.adsToday >= 3) { toast(fmt(L.adDailyLimit, { time: dateTime(nextMidnight()) })); break; }
          state.adsToday += 1;
          state.balance += 1;
          renderAccount();
          if (screen.classList.contains("is-sheet")) updateWrite();
          toast(L.previewEarned);
          break;
        case "buy": toast(L.previewBuy); break;
        case "demo": toast(DEMO_NOTE); break;
      }
    });
    root.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (overlay.querySelector(".oms-dialog,.oms-menu,.oms-popover")) closeFloating();
      else if (screen.classList.contains("is-sheet") && !screen.classList.contains("is-sending")) closeWrite();
    });

    renderAll();

    // Stops this copy's timers before a rebuild in another language.
    return function () {
      clearTimeout(toastTimer);
      clearTimeout(noticeTimer);
      clearInterval(frameTimer);
      sendTimers.forEach(clearTimeout);
      window.removeEventListener("resize", fit);
    };
  }
})();
