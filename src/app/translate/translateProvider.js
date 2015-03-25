'use strict';

var app = angular.module('trigger');

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    /* Login */
    'loginUsername': 'Username',
    'loginPassword': 'Password',
    'loginSubmit': 'Yarrr!',
    /* Console */
    'consoleLogIn': 'Log in',
    'consoleListeners': 'Listeners',
    'consoleActiveUsers': 'Active users',
    'consoleYouCanUpload': 'You can upload',
    'consoleDonateMe': 'Donate',
    'consoleChangeTheme': 'Change theme',
    'consoleRTFM': 'RTFM',
    'consoleLogOut': 'Log out',
    /* Info */
    'infoTabChat': 'Chat',
    'infoTabHistory': 'History',
    'infoTabDemocracy': 'Democracy',
    'infoTabProfile': 'Profile',
    /* Democracy */
    'democracyElections': 'Elections',
    'democracyCandidate': 'Candidate ID',
    'democracyVoted': 'You voted for',
    'democracyVote': 'Vote',
    'democracyTabModer': 'Moder',
    'democracyTabBlog': 'Blogs',
    /* Chat */
    'startTyping': 'type your message here...',
    'chatBold': 'bold',
    'chatIrony': 'irony',
    'chatTink': 'tink',
    'chatImg': 'images',
    /* Online */
    'onlineHere':'Here',
    /* History */
    'historyGold': 'gold',
    'historyArtist': 'Artist',
    'historyTitle': 'Title',
    'historyNoResults': 'No results ):',
    /* Playlist */
    'trackUploadedBy': 'uploaded by',
    'trackToChat': 'send to chat',
    /* Profile */
    'profileUser': 'User',
    'profileUploads': 'Uploads',
    'profilePluses': 'Pluses',
    'profileMinuses': 'Minuses',
    'profileSettings': 'Settings',
    /* User */
    'userBan': 'Ban',
    'userIgnore' :'Ignore',
    'userInvitedBy' :'Invited by',
    'userInvite': 'Invited',
    'userRegDate' :'Registered',
    /* Settings */
    'settingsLogOut': 'Log out',
    'settingsTink': 'Tink',
    'settingsImg': 'Show images',
    'settingsFemale': 'Yahooo! I am woman',
    'settingsOldPassword': 'Old password',
    'settingsNewPassword': 'New password',
    'settingsNewPasswordAgain': 'Type new password again',
    'settingsNewPasswordSumbit': 'Change password!'
  });
  $translateProvider.translations('ru', {
    /* Login */
    'loginUsername': 'Логин',
    'loginPassword': 'Пароль',
    'loginSubmit': 'Трям!',
    /* Console */
    'consoleLogIn': 'Войти',
    'consoleListeners': 'Слушают',
    'consoleActiveUsers': 'из них активно',
    'consoleYouCanUpload': 'Ты можешь залить',
    'consoleDonateMe': 'Жертвенник',
    'consoleChangeTheme': 'Сделать день',
    'consoleRTFM': 'Мануал',
    'consoleLogOut': 'Выйти',
    /* Info */
    'infoTabChat': 'Чат',
    'infoTabHistory': 'История',
    'infoTabDemocracy': 'Демократия',
    'infoTabProfile': 'Профиль',
    /* Democracy */
    'democracyElections': 'Выборы',
    'democracyCandidate': 'ID кандидата',
    'democracyVoted': 'Ты проголосовал за',
    'democracyVote': 'Голосовать',
    'democracyTabModer': 'Модер',
    'democracyTabBlog': 'Блоги',
    /* Chat */
    'startTyping': 'начинай вводить...',
    'chatBold': 'bold',
    'chatIrony': 'irony',
    'chatTink': 'тиньк',
    'chatImg': 'картинки',
    /* Online */
    'onlineHere':'Здесь',
    /* History */
    'historyGold': 'Золото',
    'historyArtist': 'Исполнитель',
    'historyTitle': 'Трек',
    'historyNoResults': 'Нет результатов',
    /* Playlist */
    'trackUploadedBy': 'прнс',
    'trackToChat': 'в чат',
    /* Profile */
    'profileUser': 'Юзер',
    'profileUploads': 'Загрузки',
    'profilePluses': 'Плюсы',
    'profileMinuses': 'Минусы',
    'profileSettings': 'Настройки',
    /* User */
    'userBan': 'Забанить',
    'userIgnore' :'ОМММ',
    'userInvitedBy' :'По приглашению',
    'userInvite': 'Понаприглашал',
    'userRegDate' :'С нами с',
    /* Settings */
    'settingsLogOut': 'Выйти',
    'settingsTink': 'Тинькать',
    'settingsImg': 'Показывать картинки',
    'settingsFemale': 'Ура, я женщина!',
    'settingsOldPassword': 'Старый пароль',
    'settingsNewPassword': 'Новый пароль',
    'settingsNewPasswordAgain': 'Новый пароль еще раз',
    'settingsNewPasswordSumbit': 'Я понимаю что делаю!'
  });

  $translateProvider.translations('he', {
    /* Login */
    'loginUsername': 'שם משתמש',
    'loginPassword': 'סיסמא',
    'loginSubmit': 'שלח!',
    /* Console */
    'consoleLogIn': 'התחבר',
    'consoleListeners': 'מאזינים',
    'consoleActiveUsers': 'משתמשים פעילים',
    'consoleYouCanUpload': 'אתה כרגע יכול להעלות ',
    'consoleDonateMe': 'לתרום לפיתוח',
    'consoleChangeTheme': 'שנה ',
    'consoleRTFM': 'RTFM',
    'consoleLogOut': 'צא',
    /* Info */
    'infoTabChat': 'צ\'אט',
    'infoTabHistory': 'היסטוריה',
    'infoTabDemocracy': 'דמוקרטיה',
    'infoTabProfile': 'פרופיל',
    /* Democracy */
    'democracyElections': 'בחירות',
    'democracyCandidate': 'ID המועמד',
    'democracyVoted': 'בחרתם ב',
    'democracyVote': 'בחר',
    'democracyTabModer': 'מנהל',
    'democracyTabBlog': 'בלוג',
    /* Chat */
    'startTyping': 'תרשום פה...',
    'chatBold': 'bold',
    'chatIrony': 'irony',
    'chatTink': 'צליל התראה',
    'chatImg': 'תמונות',
    /* Online */
    'onlineHere':'פה כרגע',
    /* History */
    'historyGold': 'זהב',
    'historyArtist': 'שם האומן',
    'historyTitle': 'שם הטראק',
    'historyNoResults': 'אין תוצאות ):',
    /* Playlist */
    'trackUploadedBy': 'הועלה ע"י" ',
    'trackToChat': 'שלח לצ\'אט',
    /* Profile */
    'profileUser': 'שם משתמש',
    'profileUploads': 'העלאות',
    'profilePluses': 'חיוביים',
    'profileMinuses': 'שליליים',
    'profileSettings': 'הגדרות',
    /* User */
    'userBan': 'חסום',
    'userIgnore' :'התעלם',
    'userInvitedBy' :'הוזמן ע"י"',
    'userInvite': 'הוזמן',
    'userRegDate' :'רשום',
    /* Settings */
    'settingsLogOut': 'צא',
    'settingsTink': 'צליל התראה',
    'settingsImg': 'תראה תמונות',
    'settingsFemale': 'יששש! אני בחורה',
    'settingsOldPassword': 'סיסמא ישנה',
    'settingsNewPassword': 'סיסמא חדשה',
    'settingsNewPasswordAgain': 'עוד הפעם , סיסמא חדשה',
    'settingsNewPasswordSumbit': 'שנה סיסמא!'
  });

  $translateProvider.registerAvailableLanguageKeys(['en', 'ru'], {
    'en_US': 'en',
    'en_UK': 'en',
    'ru_RU': 'ru'
  });

// Determining preferred language automatically
//  $translateProvider.determinePreferredLanguage();

  $translateProvider.preferredLanguage('en');
  $translateProvider.fallbackLanguage('en');
}]);
