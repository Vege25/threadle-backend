import express from 'express';
import {authenticate} from '../../middlewares';
import {
  themeListGet,
  themeListGetByUserId,
  themePost,
} from '../controllers/themeController';
/**
 * @api {get} /themes Get All Themes
 * @apiName GetAllThemes
 * @apiGroup Themes
 *
 * @apiDescription Get a list of all themes.
 *
 * @apiSuccess {Number} theme_id Theme's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the theme.
 * @apiSuccess {String} color1 Color 1 of the theme.
 * @apiSuccess {String} color2 Color 2 of the theme.
 * @apiSuccess {String} color3 Color 3 of the theme.
 * @apiSuccess {String} color4 Color 4 of the theme.
 * @apiSuccess {String} font1 Font 1 of the theme.
 * @apiSuccess {String} font2 Font 2 of the theme.
 * @apiSuccess {String} created_at Time when the theme was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "theme_id": 1,
 *         "user_id": 123,
 *         "color1": "#FFFFFF",
 *         "color2": "#000000",
 *         "font1": "Arial",
 *         "font2": "Roboto",
 *         "created_at": "2024-04-14T12:00:00Z"
 *       },
 *       {
 *         "theme_id": 2,
 *         "user_id": 456,
 *         "color1": "#FF0000",
 *         "color2": "#00FF00",
 *         "font1": "Verdana",
 *         "font2": "Times New Roman",
 *         "created_at": "2024-04-14T12:30:00Z"
 *       }
 *     ]
 */

/**
 * @api {get} /themes/:id Get Theme by User ID
 * @apiName GetThemeByUserId
 * @apiGroup Themes
 *
 * @apiDescription Get a theme by user ID.
 *
 * @apiParam {String} id User ID to get the theme for.
 *
 * @apiSuccess {Number} theme_id Theme's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the theme.
 * @apiSuccess {String} color1 Color 1 of the theme.
 * @apiSuccess {String} color2 Color 2 of the theme.
 * @apiSuccess {String} color3 Color 3 of the theme.
 * @apiSuccess {String} color4 Color 4 of the theme.
 * @apiSuccess {String} font1 Font 1 of the theme.
 * @apiSuccess {String} font2 Font 2 of the theme.
 * @apiSuccess {String} created_at Time when the theme was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "theme_id": 1,
 *       "user_id": 123,
 *       "color1": "#FFFFFF",
 *       "color2": "#000000",
 *       "font1": "Arial",
 *       "font2": "Roboto",
 *       "created_at": "2024-04-14T12:00:00Z"
 *     }
 */

/**
 * @api {post} /themes Create or Update Theme
 * @apiName CreateOrUpdateTheme
 * @apiGroup Themes
 *
 * @apiDescription Create or update a theme for the authenticated user.
 *
 * @apiHeader {String} Authorization Users unique access-token (Bearer Token).
 *
 * @apiParam {String} color1 Color 1 of the theme.
 * @apiParam {String} [color2] Color 2 of the theme (optional).
 * @apiParam {String} [color3] Color 3 of the theme (optional).
 * @apiParam {String} [color4] Color 4 of the theme (optional).
 * @apiParam {String} [font1] Font 1 of the theme (optional).
 * @apiParam {String} [font2] Font 2 of the theme (optional).
 *
 * @apiSuccess {Number} theme_id Theme's unique ID.
 * @apiSuccess {Number} user_id User's unique ID associated with the theme.
 * @apiSuccess {String} color1 Color 1 of the theme.
 * @apiSuccess {String} color2 Color 2 of the theme.
 * @apiSuccess {String} color3 Color 3 of the theme.
 * @apiSuccess {String} color4 Color 4 of the theme.
 * @apiSuccess {String} font1 Font 1 of the theme.
 * @apiSuccess {String} font2 Font 2 of the theme.
 * @apiSuccess {String} created_at Time when the theme was created.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "theme_id": 1,
 *       "user_id": 123,
 *       "color1": "#FFFFFF",
 *       "color2": "#000000",
 *       "font1": "Arial",
 *       "font2": "Roboto",
 *       "created_at": "2024-04-14T12:00:00Z"
 *     }
 */

const router = express.Router();

router.route('/').get(themeListGet).post(authenticate, themePost);

router.route('/:id').get(themeListGetByUserId);

export default router;
