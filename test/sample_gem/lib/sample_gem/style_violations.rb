class StyleViolations
  def string_concatenation(name)
    message = "Hello, " + name + "!"
    puts message
  end

  def missing_spaces(x,y,z)
    result=x+y*z
    return result
  end

  def bad_conditionals(age)
    if age >= 18
      return true
    else
      return false
    end
  end

  def using_or_and(name, email)
    return false if name.nil? or name.empty?
    return false if email.nil? and email.empty?
    true
  end

  def camelCaseMethod(value)
    value.to_s
  end

  def for_loop_usage(items)
    results = []
    for item in items
      results.push(item * 2)
    end
    results
  end
end
