# 1 移除 as unknown
# 2.移除 plainToInstance 和 class-transformer
# 3.全部不要使用相对路径，而是使用 at 符号的绝对路径
# 4. 检查 sanitizeXXX 和 transformXXXToDto 是否有用，是否可以替换成直接调用 transformToCamelCase，保持代码的简介