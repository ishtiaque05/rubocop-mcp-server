class User
  attr_accessor :name, :email, :age

  def initialize(name, email, age)
    @name = name
    @email = email
    @age = age
  end

  def update_attributes(attrs)
    attrs.each do |key, value|
      send("#{key}=", value)
    end
  end

  def find_by_name(users, name)
    users.select { |u| u.name == name }.first
  end
end

class UserService
  def self.create_user(params)
    user = User.new(params[:name], params[:email], params[:age])
    user.save
    user
  end
end
