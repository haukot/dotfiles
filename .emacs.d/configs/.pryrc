# эта штука нужна, чтобы multiline вставка работала
Pry.commands.delete /\.(.*)/

# эта штука нужна, чтобы multiline вывод работал
# adapted https://github.com/pry/pry/blob/7642967041746d63ae37adb126687c9ec58d3faa/lib/pry/color_printer.rb#L11
Pry.config.print = lambda do |output, value, pry_instance|
  pry_instance.pager.open do |pager|
    pager.print pry_instance.config.output_prefix
    Pry::ColorPrinter.pp(value, pager, 9e99)
  end
end
