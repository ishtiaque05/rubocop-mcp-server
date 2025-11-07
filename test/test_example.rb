# Test file with intentional style issues
class UserController < ApplicationController
  def show
    @user = User.find(params[:id])

    # Bad: Using update_attributes (deprecated)
    @user.update_attributes(name: params[:name])

    # Bad: Missing spaces
    x=1+2

    # Bad: Double quotes for simple string
    greeting = "Hello"

    # Bad: Trailing whitespace on next line
    result = x * 2

    render json: @user
  end
end
