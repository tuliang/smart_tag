(function($){
  $(document).ready(function() {

    function SmartTag(select) {

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
        return text.replace(/^\s+|\s+$/g, ""); // 去掉任何空白字符
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

        // create
        for (var i = new_tags.length - 1; i >= 0; i--) {
          if (!inArray(tags, new_tags[i])) {
            ul.tagit("createTag", new_tags[i]);
          }
        }

        // remove
        for (var i = tags.length - 1; i >= 0; i--) {
          if (!inArray(new_tags, tags[i])) {
            ul.tagit("removeTagByLabel", tags[i]);
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

      function ajaxAddTag(add_tag) {
        var controller = select.attr('controller');

        if (controller) {

          var action = select.attr('action') ? select.attr('action') : 'create';
          var param = select.attr('param') ? select.attr('param') : 'title';
          var controllers = select.attr('controllers') ? select.attr('controllers') : controller+'s';

          var url = '/'+controllers+'/'+action;
          var data = {};
          data[controller+'['+param+']'] = add_tag;

          $.ajax({
            url: url,
            dataType: "json",
            type: "POST",
            data: data,
            success: function(json){
              if (json) {
                select.prepend('<option selected="selected" value="'+json.id+'">'+add_tag+'</option>');
              } else {
                console.log("josn is null");
              }
            }
          });
        } else {
          console.log("select's controller param is null");
        }
      }

      var all_options = getOptions(select.children('option'));
      var selected_options = getOptions(select.children('option:selected'));
      var ul = $('<ul class="' + select.attr('id') + '_smart_tag"></ul>');

      select.before(ul);

      ul.css({
        'margin-left': '0px',
        'width': '488px'
      });

      ul.tagit({
        availableTags: all_options,
        afterTagAdded: function(event, ui) {
          var add_tag = ui.tagLabel;
          all_options = getOptions(select.children('option'));

          if (inArray(all_options, add_tag)) {
            changeSelected(ul.tagit("assignedTags"), addSelected);   
          } else {
            ajaxAddTag(add_tag);
          }
        },
        afterTagRemoved: function(event, ui) {
          changeSelected(ul.tagit("assignedTags"), removeSelected);
        }
      });

      createTags();

      select.change(function(){
        changeTags();
      });
    }

    var selects = $(".smart_tag");

    for (var i = selects.length - 1; i >= 0; i--) {
      SmartTag($(selects[i]));
    }

  });
}(window.jQuery));