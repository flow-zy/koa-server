import userModel from '../model/userModel';
import {encrypt} from '../utils/auth';

export const useLogin = async (params: userModel) => {
  const res = await userModel.findOne({
    where: {
      username: params.username,
    },
  });
  const obj: Partial<userModel> = {};
  for (const key in res?.dataValues) {
    if (key !== 'password') {
      obj[key] = res[key];
    }
  }
  return obj;
};

export const useRegister = async (params: userModel) => {
  // 加密密码
  params.password = await encrypt(params.password);
  return await userModel.create({...params});
};

export const findByUsername = (username: string) => {
  return userModel.findOne({where: {username}});
};
