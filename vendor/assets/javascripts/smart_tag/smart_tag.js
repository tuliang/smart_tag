(function($){
  $(document).ready(function() {

    function Base(select) {
      var that = {};
      that.select = select;

      that.inArray = function(array, value) {
        for (var i = array.length - 1; i >= 0; i--) {
          if (array[i] == value) {
            return true;
          }
        }

        return false;
      };

      that.clearText = function(text) {
        // \s 匹配任何空白字符，包括空格、制表符、换页符等等。等价于[ \f\n\r\t\v]。
        return text.replace(/^\s+|\s+$/g, ""); // 去掉开头和结尾的任何空白字符
      };

      that.getOptions = function(selector) {
        var options = [];
        for (var i = selector.length - 1; i >= 0; i--) {
          var text = that.clearText($(selector[i]).text());

          if (!that.inArray(options, text)) {
            options.push(text);
          }
        }

        return options;
      };

      that.createTags = function() {
        for (var i = that.selected_options.length - 1; i >= 0; i--) { 
          that.ul.tagit("createTag", that.selected_options[i]);
        }
      };

      that.changeTags = function() {
        var new_tags = that.getOptions(that.select.children('option:selected'));
        var tags = that.ul.tagit("assignedTags")

        // remove
        for (var i = tags.length - 1; i >= 0; i--) {
          if (!that.inArray(new_tags, tags[i])) {
            that.ul.tagit("removeTagByLabel", tags[i]);
          }
        }

        // create
        for (var i = new_tags.length - 1; i >= 0; i--) {
          if (!that.inArray(tags, new_tags[i])) {
            that.ul.tagit("createTag", new_tags[i]);
          }
        }
      };

      that.addSelected = function(tags, option) {
        if (that.inArray(tags, that.clearText(option.text()))) {
          option.attr("selected", true);
        } 
      };

      that.removeSelected = function(tags, option) {
        if (!that.inArray(tags, that.clearText(option.text()))) {
          option.attr("selected", false);
        } 
      };

      that.changeSelected = function(tags, method) {
        var options = that.select.children('option');
        for (var i = options.length - 1; i >= 0; i--) {
          method(tags, $(options[i]));
        }
      };

      that.all_options = that.getOptions(select.children('option'));
      that.selected_options = that.getOptions(select.children('option:selected'));
      that.ul = $('<ul></ul>');

      select.before(that.ul);

      that.ul.css({
        'margin-left': '0px',
        'width': '488px'
      });

      that.select.change(function(){
        that.changeTags();
      });

      that.start = function() {
        that.createTags();
      };

      return that;
    }

    function SmartTag(select) {

      var that = Base(select);
      that.is_add = that.select.attr('is_add') ? that.select.attr('is_add') : true;

      that.ajaxAddTag = function(add_tag) {
        var controller = that.select.attr('controller');

        if (controller) {

          var action = that.select.attr('action') ? that.select.attr('action') : 'create';
          var param = that.select.attr('param') ? that.select.attr('param') : 'title';
          var controllers = that.select.attr('controllers') ? that.select.attr('controllers') : controller+'s';

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
      };

      that.ul.tagit({
        allowSpaces: true,
        availableTags: that.all_options,
        afterTagAdded: function(event, ui) {
          var add_tag = ui.tagLabel;
          all_options = that.getOptions(that.select.children('option'));

          that.ul.parents(".control-group").removeClass("error");

          if (that.inArray(all_options, add_tag)) {
            that.changeSelected(that.ul.tagit("assignedTags"), that.addSelected);   
          } else if (true === that.is_add) {
              that.ajaxAddTag(add_tag);
          } else {
            that.ul.tagit("removeTagByLabel", add_tag);
            that.ul.parents(".control-group").addClass("error");
          }
        },
        afterTagRemoved: function(event, ui) {
          that.changeSelected(that.ul.tagit("assignedTags"), that.removeSelected);
        }
      });

      return that;
    }

    var smart_tags = $(".smart_tag");

    for (var i = smart_tags.length - 1; i >= 0; i--) {
      var item = SmartTag($(smart_tags[i]));
      item.start();
    }

    function SingleChoice(select) {
      var that = Base(select);

      that.ul.tagit({
        allowSpaces: true,
        availableTags: that.all_options,
        tagLimit: 1,
        afterTagAdded: function(event, ui) {
          var add_tag = ui.tagLabel;
          all_options = that.getOptions(that.select.children('option'));

          if (that.inArray(all_options, add_tag)) {
            that.changeSelected(that.ul.tagit("assignedTags"), that.addSelected);  
            that.ul.parents(".control-group").removeClass("error");
            that.ul.parents(".control-group").addClass("success");
            that.ul.parents(".control-group").find('.help-inline').text("Success!");
          }else {
            that.ul.tagit("removeAll");
            that.ul.parents(".control-group").removeClass("success");
            that.ul.parents(".control-group").addClass("error");
            that.ul.parents(".control-group").find('.help-inline').text("You should choice one career.");
          }
          

          if(that.ul.tagit("assignedTags").length == 1){
            that.ul.find(".ui-autocomplete-input").attr('disabled', 'disabled');
          }
        },
        afterTagRemoved: function(event, ui) {

          that.changeSelected(that.ul.tagit("assignedTags"), that.removeSelected);

          if (that.ul.tagit("assignedTags").length < 1) {
            that.ul.find(".ui-autocomplete-input").removeAttr('disabled');
          }
        }
      });

      return that;
    }

    var single_choices = $(".single_choice");

    for (var i = single_choices.length - 1; i >= 0; i--) {
      var item = SingleChoice($(single_choices[i]));
      item.start();
    }

  });
}(window.jQuery));