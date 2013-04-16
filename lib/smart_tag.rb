require 'pathname'

require "smart_tag/version"

module SmartTag
  def self.create_tag(name, value)
    root_path ||= Pathname.new(File.dirname(File.expand_path('../', __FILE__)))
    Dir[root_path.join('vendor/assets/javascripts/smart_tag/**', '*.{js,css}')].inject([]) do |assets, path|
      puts assets << Pathname.new(path).relative_path_from(root_path.join('vendor/assets/javascripts'))
    end
    puts "#{name}  #{value}" 
  end
end
