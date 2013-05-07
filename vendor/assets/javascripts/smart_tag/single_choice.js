(function($){
  $(document).ready(function() {

    function SingleChoice(select) {

      function inArray(array, value) {
        for (var i = array.length - 1; i >= 0; i--) {
          if (array[i] == value) {
            return true;
          }
        }

        return false;
      }

      function clearText(text) {
        // \s 匹配任何空白字符，包括空格、制表符、换页符等等。等价于[ \f\n\r\t\v]。
        return text.replace(/^\s+|\s+$/g, ""); // 去掉开头或结尾的任何空白字符
      }

      function getOptions(selector) {
        var options = [];
        for (var i = selector.length - 1; i >= 0; i--) {
          var text = clearText($(selector[i]).text());

          if (!inArray(options, text)) {
            options.push(text);
          }
        }

        return options;
      }

      function createTags() {
        for (var i = selected_options.length - 1; i >= 0; i--) { 
          ul.tagit("createTag", selected_options[i]);
        }
      }

      function changeTags() {
        var new_tags = getOptions(select.children('option:selected'));
        var tags = ul.tagit("assignedTags")

        // remove
        for (var i = tags.length - 1; i >= 0; i--) {
          if (!inArray(new_tags, tags[i])) {
            ul.tagit("removeTagByLabel", tags[i]);
          }
        }

        // create
        for (var i = new_tags.length - 1; i >= 0; i--) {
          if (!inArray(tags, new_tags[i])) {
            ul.tagit("createTag", new_tags[i]);
          }
        }
      }

      function addSelected(tags, option) {
        if (inArray(tags, clearText(option.text()))) {
          option.attr("selected", true);
        } 
      }

      function removeSelected(tags, option) {
        if (!inArray(tags, clearText(option.text()))) {
          option.attr("selected", false);
        } 
      }

      function changeSelected(tags, method) {
        var options = select.children('option');
        for (var i = options.length - 1; i >= 0; i--) {
          method(tags, $(options[i]));
        }
      }

      var all_options = getOptions(select.children('option'));
      var selected_options = getOptions(select.children('option:selected'));
      var ul = $('<ul class="' + select.attr('id') + '_single_choice"></ul>');

      select.before(ul);

      ul.css({
        'margin-left': '0px',
        'width': '488px'
      });

      ul.tagit({
        allowSpaces: true,
        availableTags: all_options,
        tagLimit: 1,
        afterTagAdded: function(event, ui) {
          var add_tag = ui.tagLabel;
          all_options = getOptions(select.children('option'));

          if (inArray(all_options, add_tag)) {
            changeSelected(ul.tagit("assignedTags"), addSelected);  
            ul.parents(".control-group").removeClass("error");
            ul.parents(".control-group").addClass("success");
            ul.parents(".control-group").find('.help-inline').text("Success!");
          }else {
            ul.tagit("removeAll");
            ul.parents(".control-group").removeClass("success");
            ul.parents(".control-group").addClass("error");
            ul.parents(".control-group").find('.help-inline').text("You should choice one career.");
          }
          

          if(ul.tagit("assignedTags").length == 1){
            ul.find(".ui-autocomplete-input").attr('disabled', 'disabled');
            select.focus();
          }
        },
        afterTagRemoved: function(event, ui) {

          changeSelected(ul.tagit("assignedTags"), removeSelected);

          if (ul.tagit("assignedTags").length < 1) {
            ul.find(".ui-autocomplete-input").removeAttr('disabled');
          }
        }
      });

      createTags();

      select.change(function(){
        changeTags();
      });
    }

    var selects = $(".single_choice");

    for (var i = selects.length - 1; i >= 0; i--) {
      SingleChoice($(selects[i]));
    }

  });
}(window.jQuery));