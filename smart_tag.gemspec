# -*- encoding: utf-8 -*-
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'smart_tag/version'

Gem::Specification.new do |gem|
  gem.name          = "smart_tag"
  gem.version       = SmartTag::VERSION
  gem.authors       = ["tuliang"]
  gem.email         = ["info@tuliang.org"]
  gem.description   = %q{Tag-it: a jQuery UI plugin}
  gem.summary       = %q{Smart Tag}
  gem.homepage      = "https://github.com/tuliang/smart_tag"

  gem.files         = `git ls-files`.split($/)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.require_paths = ["lib"]
end
