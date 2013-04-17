module SmartTag
  module Helper
    
    # def tadding_tag(name, content = nil, options = {})
    #   id = sanitize_to_id(name)
    #   input_html = { :id => id }.merge(options.delete(:input_html) || {})
    #   output = ActiveSupport::SafeBuffer.new
    #   output << text_area_tag(name, content, input_html)
    # end
    
    def smart_tag(name, method, options = {})
      input_html = (options.delete(:input_html) || {})
      hash = input_html.stringify_keys
      instance_tag = ActionView::Base::FormBuilder.new(name, method, self, options.delete(:object))
      instance_tag.send(:add_default_name_and_id, hash)      
      output_buffer = ActiveSupport::SafeBuffer.new
      output_buffer << '<ul class="smart_tag"></ul>'#instance_tag.to_text_area_tag(input_html)
    end
     
  end
  
  module Builder
    def smart_tag(method, options = {})
      @template.send("smart_tag", @object_name, method, objectify_options(options))
    end
  end
end