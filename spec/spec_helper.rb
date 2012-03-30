require "rack"
require "capybara"
require "capybara/dsl"
require 'capybara/rspec'

RSpec.configure do |config|

  config.before :suite do
    Capybara.app = Rack::Builder.parse_file(File.expand_path('../../config.ru', __FILE__)).first
    Capybara.default_driver = :selenium
    Capybara.default_wait_time = 3
  end

end