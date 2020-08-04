var lmnEditor = {
   open: (id, content) => {
      if(content == ''){
         content = '<div>&#8203;</div>';
      };
      $('#' + id + "-content").attr('contenteditable', 'true');
      $('#' + id + "-content").html(content);
      $('#' + id + "-tools").html(lmnEditor.toolsContent());
      lmnEditor.addEditorContentChangeEvent(id);
   },
   addEditorContentChangeEvent: (id) => {
      lmnEditor.EditorContent[id] = document.getElementById(id + '-content');
      lmnEditor.EditorContentChange.observe(lmnEditor.EditorContent[id], { 
         attributes: true, 
         childList: true, 
         characterData: true,
         subtree: true
      });
   },
   zeroWideSpace: (code, node) => {
      if(code.substring(0,4) != '<div'){
         $(node).html('<div>&#8203;</div>');
         var sel = window.getSelection();
         sel.removeAllRanges();
         var range = document.createRange();
         range.selectNodeContents(node.firstElementChild);
         sel.addRange(range);
      };
   },
   deleteBrTag: (code, node) => {
      return(true);
      if(code.indexOf('<br>') > 0){
         $(node).html('\u200b');
         var sel = window.getSelection();
         sel.removeAllRanges();
         var range = document.createRange();
         range.selectNodeContents(node);
         sel.addRange(range);
      };
   },
   EditorContentChange: new MutationObserver(() => {
      var sel = window.getSelection();
      range = sel.getRangeAt(0);
      var node = range.commonAncestorContainer;
      var editor = $(node).closest('.lmnEditor');
      var id = $(editor).attr("id");
      var editorNode = document.getElementById(id + "-content");
      var code = $(editorNode).html();
      lmnEditor.deleteBrTag(code, node);
      lmnEditor.zeroWideSpace(code, editorNode);
      if(lmnEditor.onChange[id]){
         var content = document.getElementById(id + "-content").innerHTML;
         lmnEditor.onChange[id](content);
      }
   }),
   toolsContent: () => {
      var content = '';
      var i,j;
      for(i = 0; i < lmnEditor.showTools.length; i++){
         var toolsSet = '';
         var toolsElement = Object.keys(lmnEditor.tools[lmnEditor.showTools[i]].elements);
         for(j = 0; j < toolsElement.length; j++){
            toolsSet = toolsSet +
            '<button type="button" class="lmnEditor toolButton" name="' + lmnEditor.tools[lmnEditor.showTools[i]].elements[toolsElement[j]].name + '__of__' + lmnEditor.showTools[i] + '"><span class="' + lmnEditor.tools[lmnEditor.showTools[i]].elements[toolsElement[j]].name + '__of__' + lmnEditor.showTools[i] + '">' + lmnEditor.tools[lmnEditor.showTools[i]].elements[toolsElement[j]].showName + '</span></button>';
         };
         content = content +
         '<div class="lmnEditor toolButtonSet"><span class="lmnEditor toolButtonSetName">' + lmnEditor.tools[lmnEditor.showTools[i]].name + '</span>' + toolsSet + '</div>';
      };
      return(content);
   },
   toolButtonPushed: (name)=> {
      var sel = window.getSelection();
      range = sel.getRangeAt(0);
      var node = range.commonAncestorContainer;
      var editor = $(node).closest('.lmnEditor');
      var id = $(editor).attr("id");
      if($(node).closest('#' + id + "-content").length <= 0){
			return(false);
      };
      var elementName = name.substring(0, name.indexOf('__of__'));
      var toolName = name.substring(name.indexOf('__of__') + 6);
      var tooltype = lmnEditor.tools[toolName].type;
      if(tooltype == 'div'){
         lmnEditor.toolTypeDiv(elementName, toolName, sel, range);
      }else if(tooltype == 'span'){
         lmnEditor.toolTypeSpan(elementName, toolName, sel, range);
      };
   },
   onChange: {},
   EditorContent: {},
   tools: {
      "lmnHeadline": {
         "name": "<i class=\"fa fa-font\" aria-hidden=\"true\"></i>",
         "type": "div",
         "elements": [
            {"name": "unset", "showName": "標準"},
            {"name": "headline1", "showName": "見出し大"},
            {"name": "headline2", "showName": "見出し小"}
         ]
      },
      "lmnMarking": {
         "name": "<i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i>",
         "type": "span",
         "elements": [
            {"name": "unset", "showName": "なし"},
            {"name": "important", "showName": "重要"},
            {"name": "note", "showName": "注意"},
            {"name": "red", "showName": "赤"},
            {"name": "green", "showName": "緑"},
            {"name": "blue", "showName": "青"},
            {"name": "purple", "showName": "紫"},
            {"name": "yellow", "showName": "黄"}
         ]
      }
   },
   showTools: ['lmnHeadline', 'lmnMarking'],
   toolTypeDiv: (elementName, toolName, sel, range) => {
      var node = range.startContainer;
      sel.removeAllRanges();
      while(!(node.tagName)){
         var node = node.parentNode;
      };
      while(!(node.tagName.toUpperCase() == 'DIV')){
         node = node.parentNode;
      };
      var toolElements = lmnEditor.tools[toolName].elements;
      var i;
      for(i = 0; i < toolElements.length; i++){
         $(node).removeClass(toolElements[i].name + '__of__' + toolName);
      };
      if(elementName != 'unset'){
         $(node).addClass(elementName + '__of__' + toolName);
      };
      range.selectNodeContents(node);
      range.collapse(false);
      sel.addRange(range);
   },
   toolTypeSpan: (elementName, toolName, sel, range) => {
      var parentNode = range.commonAncestorContainer;
      var newStartNode = document.createElement('span');
      newStartNode.setAttribute('id', 'lmnNewStartNode');
      newStartNode.innerHTML = '';
      var newEndNode = document.createElement('span');
      newEndNode.setAttribute('id', 'lmnNewEndtNode');
      newEndNode.innerHTML = '';
      range.insertNode(newStartNode);
      range.collapse(false);
      range.insertNode(newEndNode);
      while(!(parentNode.tagName)){
         var parentNode = parentNode.parentNode;
      };
      while(!(parentNode.tagName.toUpperCase() == 'DIV')){
         parentNode = parentNode.parentNode;
      };
      var code = parentNode.innerHTML;
      var divTags = lmnEditor.splitTag(code);
      if(divTags.length == 0){
         if(elementName == 'unset'){
            var newNode = document.createElement('textContent');
         }else{
            var newNode = document.createElement('span');
            newNode.setAttribute('class', elementName + '__of__' + toolName);
         };
         console.log(code)
         console.log(code.substring(code.indexOf('<span id="lmnNewStartNode"></span>') + 34, code.indexOf('<span id="lmnNewEndtNode"></span>')), elementName)
         newNode.innerHTML = lmnEditor.deleteSpan(code.substring(code.indexOf('<span id="lmnNewStartNode"></span>') + 34, code.indexOf('<span id="lmnNewEndtNode"></span>')), toolName);
         range.setStartBefore(newStartNode);
         range.setEndAfter(newEndNode);
         range.deleteContents();
         range.insertNode(newNode);
         console.log(newNode)
      };
      console.log(code);
      console.log(divTags);
   },
   splitTag: (code) => {
      var i;
      var nestDepth = 0;
      var breakPoint = 0;
      var tags = []
      for(i = 0; i < code.length - 1; i++){
         if(code.substring(i, i + 6) == '</div>'){
            nestDepth = nestDepth - 1;
            if(nestDepth == 0){
               tags.push(code.substring(breakPoint, code.indexOf('>', i + 2) + 1));
               breakPoint = code.indexOf('>', i + 2) + 1;
            }
         }else if(code.substring(i, i + 4) == '<div'){
            nestDepth = nestDepth + 1;
            if(nestDepth == 1){
               tags.push(code.substring(breakPoint, i));
               breakPoint = i;
            };
         };
      };
      var tagsWithoutSpace = [];
      for(i = 0; i < tags.length; i++){
         if(tags[i] != ''){
            tagsWithoutSpace.push(tags[i]);
         };
      };
      return(tagsWithoutSpace);
   },
   deleteSpan(code, toolName){
      var i, j;
      var nestDepth = 0
      var foundStartTag = false;
      var foundDepth = - 10;
      for(i = 0; i < code.length - 7; i++){
         if(code.substring(i, i + 7) == '</span>'){
            nestDepth = nestDepth - 1;
            if((foundStartTag) && (nestDepth == foundDepth - 1)){
               code = code.substring(0, i) + code.substring(i + 7);
               return(lmnEditor.deleteSpan(code, toolName));
            }
         }else if(code.substring(i, i + 5) == '<span'){
            nestDepth = nestDepth + 1;
            var tag = code.substring(i, code.indexOf('>', i) + 1);
            if((tag.indexOf(toolName) >= 0) && !(foundStartTag)){
               code = code.substring(0, i) + code.substring(i + tag.length);
               foundStartTag = true;
               foundDepth = nestDepth;
            };
         };
      };
      return(code);
   }
};
$(() => {
   $(document).on("click", ".lmnEditor.toolButton", function () {
      lmnEditor.toolButtonPushed($(this).attr('name'));
   });
});