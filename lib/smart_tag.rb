require 'pathname'

require "smart_tag/version"

module SmartTag
  def self.create_tag(name, value)
    puts "#{name}  #{value}" 
  end
end
