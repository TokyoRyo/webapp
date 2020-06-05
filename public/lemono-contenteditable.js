$(function(){
   function isEditor(node){
		if($(node).closest(".lemono-contenteditable__content").length > 0){
			return true;
		}
		else{
			false;
		}
   }
   function addspan(classname, deleteclass){
		var sel = window.getSelection();
		if(!sel.rangeCount) return;
		var range = sel.getRangeAt(0);
		var node = range.commonAncestorContainer;
		if (isEditor(node)){
			var content = sel.toString();
			if ((node.parentNode.innerHTML == content) && (node.parentNode.nodeName.toUpperCase() == 'SPAN')){
				var i = 0;
				for (i=0; i < deleteclass.length; i++){
					if ($(node.parentNode).hasClass(deleteclass[i])){
						$(node.parentNode).removeClass(deleteclass[i]);
					}
				}
				$(node.parentNode).addClass(classname);
			}
			else{
				if (content == '') content = '\u200B'
				var newNode = document.createElement('span');
				newNode.setAttribute('class', classname);
				newNode.innerHTML = content;
				range.deleteContents();
				range.insertNode(document.createTextNode('\u200B'))
				range.insertNode(newNode); 
				var newrange = document.createRange();
				//newrange.setStart(newNode, 0);
				//newrange.collapse(true);
				newrange.setStartAfter(newNode);
				newrange.collapse(true);
				sel.removeAllRanges();
				sel.addRange(newrange);
			}
			
		}
   }
   $(document).on('click', '.lemono-contenteditable__button-color', function(){
      addspan($(this).attr("name"),['lemono-marking__normal', 'lemono-marking__important','lemono-marking__note', 'lemono-marking__red', 'lemono-marking__green', 'lemono-marking__blue', 'lemono-marking__purple', 'lemono-marking__yellow', 'lemono-marking__large']);
   })
})