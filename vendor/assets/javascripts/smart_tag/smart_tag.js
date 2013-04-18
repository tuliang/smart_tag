(function($){
  $(document).ready(function() {

    function SmartTag(select) {

      function in_array(array, value) {
        for (var i = array.length - 1; i >= 0; i--) {
          if (array[i] == value) {
            return true;
          }
        }

        return false;
      }

      function get_options_text(options) {
        var options_text = [];
        for (var i = options.length - 1; i >= 0; i--) {
          var text = $(options[i]).text();

          if (!in_array(options_text, text)) {
            options_text.push(text);
          }
        }

        return options_text;
      }

      function add_tags(ul) {
        var selected_options_text = get_options_text(select.children('option:selected'));
        ul.tagit("removeAll");
        for (var i = selected_options_text.length - 1; i >= 0; i--) { 
          ul.tagit("createTag", selected_options_text[i]);
        }
      }

      function ul_to_selected(tags) {
        for (var i = options.length - 1; i >= 0; i--) {
          var option = $(options[i]);
          if (in_array(tags, option.text())) {
            option.attr("selected", true);
          } else {
            option.attr("selected", false);
          }
        }
      }

      var options = select.children('option');
      var all_options_text = get_options_text(options);
      var ul = $('<ul class="' + select.attr('id') + '_smart_tag"></ul>');

      select.before(ul);

      ul.css({
        'margin-left': '0px',
        'width': '488px'
      });

      ul.tagit({
        availableTags: all_options_text,
        afterTagAdded: function(event, ui) {
          ul_to_selected(ul.tagit("assignedTags"));
        },
        afterTagRemoved: function(event, ui) {
          ul_to_selected(ul.tagit("assignedTags"));
        }
      });

      add_tags(ul);

      select.change(function(){
        add_tags(ul);
      });
    }

    var selects = $(".smart_tag");

    for (var i = selects.length - 1; i >= 0; i--) {
      SmartTag($(selects[i]));
    }

  });
}(window.jQuery));