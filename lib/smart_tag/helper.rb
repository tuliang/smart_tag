module SmartTag
  module Helper
    
    def smart_tag(name, content = nil, options = {})
      id = sanitize_to_id(name)
      input_html = { :id => id }.merge(options.delete(:input_html) || {})
      output = ActiveSupport::SafeBuffer.new
      output << text_area_tag(name, content, input_html)
    end
    
    def tag(name, method, options = {})
      input_html = (options.delete(:input_html) || {})
      hash = input_html.stringify_keys
      instance_tag = ActionView::Base::InstanceTag.new(name, method, self, options.delete(:object))
      instance_tag.send(:add_default_name_and_id, hash)      
      output_buffer = ActiveSupport::SafeBuffer.new
      output_buffer << instance_tag.to_text_area_tag(input_html)
    end
     
  end
  
  module Builder
    def tag(method, options = {})
      @template.send("tag", @object_name, method, objectify_options(options))
    end
  end
end