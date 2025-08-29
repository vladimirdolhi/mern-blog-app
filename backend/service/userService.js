const UserDto = require("../dto/user-dto");
const userModel = require("../model/user-model");
const bcrypt = require("bcrypt");
const tokenService = require("./token-service");
const ApiError = require("../exceptions/ApiError");

class UserService {
  async registration(email, name, password) {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw ApiError.BadRequest(`User with email=${email} aready exists`);
    }
    console.log(password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userModel.create({
      email,
      name,
      password: hashedPassword,
    });
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest(`User with email = ${email} is not exist`);
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Invalid password");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
