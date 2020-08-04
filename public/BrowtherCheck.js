$(function(){
   if(!(bowser.check({chrome: "80", edge: "80", firefox: "75", safari: "13"}) && ((bowser.name == 'Chrome') || (bowser.name == 'Edge') || (bowser.name == 'Firefox') || (bowser.name == 'Safari')))){
      var UnSupport = '' +
      '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
      '<strong>サポートされていないブラウザです。</strong>お使いのブラウザ(' + bowser.name + ' バージョン' + bowser.version + ')では本アプリが正しく動作しない可能性があります。<br>動作確認済みブラウザ：Chrome 80以上 / Edge 80以上 / Firefox 75以上 / Safari 13以上' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '<span aria-hidden="true">&times;</span>' +
      '</button>' +
      '</div>';
      $('.UnSupport').html(UnSupport);
   };
});