import userModel from '../model/userModel';
import {encrypt} from '../utils/auth';

export const useLogin = () => {};

export const useRegister = async (params: userModel) => {
  // 加密密码
  params.password = await encrypt(params.password);
  return await userModel.create({...params});
};

export const findByUsername = (username: string) => {
  return userModel.findOne({where: {username}});
};
