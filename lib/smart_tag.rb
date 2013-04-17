require 'smart_tag/engine'
require 'smart_tag/helper'

module SmartTag
  def self.setup
    yield self
  end
end
