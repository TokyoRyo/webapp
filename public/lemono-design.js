$(function(){
   var currentScrollPos = 0;
   var i;
   var titleOffset = [];
   var titleHref = [];
   for(i = 0; i < $('.lemono-title').length; i++){
      titleOffset.push($('.lemono-title').eq(i).offset().top);
      titleHref.push($('.lemono-title').eq(i).attr('id'));
   };
   $('.lemono-mainlayout__content').scroll(function(){
      var scrollPos = $('.lemono-mainlayout__content').scrollTop();
      var i;
      $('.lemono-title-nav').removeClass('active');
      for(i = 0; i < titleOffset.length; i++){
         if(scrollPos + 200 > titleOffset[i]){
            var thisHref = titleHref[i];
         };
      };
      for(i = 0; i < $('.lemono-title-nav').length; i++){
         if($('.lemono-title-nav').eq(i).attr('href') == '#' + thisHref){
            $('.lemono-title-nav').eq(i).addClass('active');
         };
      };
      if (Math.abs($('.lemono-mainlayout__content').scrollTop() - currentScrollPos) > 50){
         anime({
            targets: '.lemono-title__content',
            'font-size': [
               {value: '3rem', duration: 10},
               {value: '1.5rem', delay: 2000, duration: 200}
            ],
            easing: 'easeInOutSine',
            duration: 500
         });
         anime({
            targets: '.lemono-title',
            'border-bottom-width': [
               {value: '10px', duration: 10},
               {value: '0', delay: 2000, duration: 200}
            ],
            easing: 'easeInOutSine'
         });
      };
      currentScrollPos = $('.lemono-mainlayout__content').scrollTop();
   });
   $('.once').on('click', function(){
      $(this).html('<div class="lemono-button__proceeding-icon">a</div>処理中...');
      $(this).prop('disabled', true);
      $(this).addClass('lemono-button__proceeding');
      anime({
         targets: '.lemono-button__proceeding-icon',
         borderRadius:[
            {value: '50%', duration: 400},
            {value: '0%', duration: 400}
         ],
         loop: true,
         easing: 'easeInOutSine'
      });
   });
   $('input').on('focusout keyup', function(){
      if(($(this).val() == '')&&($(this).prop('required'))&&($(this).parent().hasClass('lemono-textbox'))){
         $(this).parent().addClass('error');
      }
      else{
         $(this).parent().removeClass('error');
      };
   });
   $('select').on('focusout change', function(){
      if(($(this).val() == '')&&($(this).prop('required'))&&($(this).parent().hasClass('lemono-select'))){
         $(this).parent().addClass('error');
      }
      else{
         $(this).parent().removeClass('error');
      };
   });
   $('.lemono-drawer__button').on('click', function(){
      $('.lemono-mainlayout__aside').toggleClass('open');
   });
   $('.lemono-tab__button').on('click', function(){
      var thisClasses = $(this).attr('class').split(' ');
      var i;
      for(i = 0; i < thisClasses.length; i++){
         if(thisClasses[i].substring(0,18) == 'lemono-tab__group-'){
            var tabGroup = thisClasses[i].substring(18);
         };
         if(thisClasses[i].substring(0,17) == 'lemono-tab__name-'){
            var tabName = thisClasses[i].substring(17);
         };
      };
      console.log(tabGroup);
      console.log(tabName);
      console.log('.lemono-tab__group-' + tabGroup + '.lemono-tab__name-' + tabName);
      $('.lemono-tab__group-' + tabGroup).removeClass('active');
      $('.lemono-tab__group-' + tabGroup + '.lemono-tab__name-' + tabName).addClass('active');
   });
   $('.lemono-popup__open').on('click', function(){
      $('.lemono-popup').addClass('active');
      var thisClasses = $(this).attr('class').split(' ');
      var i;
      for(i = 0; i < thisClasses.length; i++){
         if(thisClasses[i].substring(0,19) == 'lemono-popup__name-'){
            var popupName = thisClasses[i].substring(19);
         };
      };
      lemonoStyle.openPopUp(popupName);
   });
   $('.lemono-popup__close').on('click', lemonoStyle.closePopUp);
});
var readyed = 0;
var lemonoStyle = {
   loading: function(thisReadyFor){
      readyFor = thisReadyFor
      loadingAnimation = anime({targets: '.lemono-loading__animation',
         translateX: [
            {value: 250, duration: 500},
            {value: 50, duration: 500}
         ],
         borderRadius:[
            {value: '0%', duration: 500},
            {value: '50%', duration: 500}
         ],
         loop: true}),
      $('.lemono-loading').removeClass('loaded');
   },
   loaded: function(){
      readyed = readyed + 1;
      if(readyed >= readyFor){
         loadingAnimation.pause();
         $('.lemono-loading').addClass('loaded');
      }
   },
   openPopUp: function(popupName){
      $('.lemono-popup__content').removeClass('active');
      $('.lemono-popup__content.lemono-popup__name-' + popupName).addClass('active');
   },
   closePopUp: function(){
      $('.lemono-popup').removeClass('active');
   },
   createButton: function(Class, Id, Content){
      if(Class != ''){
         Class = ` class=\\"${Class}\\"`
      }
      if(Id != ''){
         Id = ` id=\\"${Id}\\"`
      }
      return `<button${Class}${Id}>${Content}</button>`
   },
   createCard: function({
      index = '',
      rightIndex = '',
      content = '',
      actions = '',
      Class = 'lemono-card',
      Id = ''
   }){
      if(Class != 'lemono-card'){
         Class = 'lemono-card ' + Class;
      };
      if(Id != ''){
         Id = ' id="' + Id + '"';
      };
      var code = `<div class=\\"${Class}"${Id}\\">`;
      if(index != ''){
         code = code + `<span class="lemono-card__index">${index}</span>`;
      };
      if(rightIndex != ''){
         code = code + `<span class="lemono-card__index-right">${index}</span>`;
      };
      if(content != ''){
         code = code + `<span class="lemono-card__content">${content}</span>`;
      };
      if(actions != ''){
         code = code + `<span class="lemono-card__actions">${content}</span>`;
      };
      code = code + '</div>'
      return code;
   },
   al: function(){
      console.log('aaaaaaa')
   }
};