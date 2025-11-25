require_relative "lib/sample_gem/version"

Gem::Specification.new do |spec|
  spec.name          = "sample_gem"
  spec.version       = SampleGem::VERSION
  spec.authors       = ["Test Author"]
  spec.email         = ["test@example.com"]

  spec.summary       = "Sample gem for testing RuboCop MCP server"
  spec.description   = "A simple gem with intentional RuboCop violations for testing"
  spec.homepage      = "https://github.com/example/sample_gem"
  spec.license       = "MIT"
  spec.required_ruby_version = ">= 2.7.0"

  spec.files         = Dir["lib/**/*.rb"]
  spec.require_paths = ["lib"]
end
