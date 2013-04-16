require "smart_tag/version"

module SmartTag
  def self.create_tag(name, value)
    puts "#{name}  #{value}" 
  end

  def self.root_path
    @root_path ||= Pathname.new(File.dirname(File.expand_path('../', __FILE__)))
  end
  
  def self.assets
    Dir[root_path.join('vendor/assets/javascripts/smart_tag/**', '*.{js,css}')].inject([]) do |assets, path|
      assets << Pathname.new(path).relative_path_from(root_path.join('vendor/assets/javascripts'))
    end
  end
end
