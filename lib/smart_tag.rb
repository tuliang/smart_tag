require 'taggingform/engine'
require 'taggingform/helper'

module SmartTag
  def self.setup
    yield self
  end
end
