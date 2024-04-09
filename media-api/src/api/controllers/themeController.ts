import {NextFunction, Request, Response} from 'express';
import {fetchAllComments, postComment} from '../models/commentModel';
import CustomError from '../../classes/CustomError';
import {Comment, Theme} from '@sharedTypes/DBTypes';

import {MessageResponse} from '@sharedTypes/MessageTypes';
import {
  fetchAllThemes,
  fetchThemeByUserId,
  postTheme,
} from '../models/themeModel';

const themeListGet = async (
  req: Request,
  res: Response<Theme[]>,
  next: NextFunction
) => {
  try {
    const themes = await fetchAllThemes();
    if (themes === null) {
      const error = new CustomError('No themes found', 404);
      next(error);
      return;
    }
    res.json(themes);
  } catch (error) {
    next(error);
  }
};
const themeListGetByUserId = async (
  req: Request<{id: string}>,
  res: Response<Theme>,
  next: NextFunction
) => {
  try {
    const user_id = Number(req.params.id);
    const theme = await fetchThemeByUserId(user_id);
    if (theme === null) {
      const error = new CustomError('No themes found', 404);
      next(error);
      return;
    }
    res.json(theme);
  } catch (error) {
    next(error);
  }
};

const themePost = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    const user_id = Number(res.locals.user.user_id);
    const {color1, color2, color3, color4, font1, font2} = req.body;

    const newTheme = await postTheme(
      user_id,
      color1,
      color2 || null,
      color3 || null,
      color4 || null,
      font1 || null,
      font2 || null
    );

    if (newTheme === null) {
      const error = new CustomError('Failed to create/update theme', 500);
      next(error);
      return;
    }

    res.json(newTheme);
  } catch (error) {
    next(error);
  }
};

export {themeListGet, themeListGetByUserId, themePost};
