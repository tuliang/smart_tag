require 'rubygems'
require 'jquery-ui-rails'
require "smart_tag"
require "rails"
require "action_controller"

module SmartTag
  module Rails
    class Engine < ::Rails::Engine
      
      initializer "smart_tag.helper_and_builder" do
        ActiveSupport.on_load :action_view do
          ActionView::Base.send(:include, SmartTag::Helper)
          ActionView::Helpers::FormBuilder.send(:include, SmartTag::Builder)
        end
      end
      
    end
  end
end