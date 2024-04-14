import express, {Request, Response} from 'express';

import mediaRoute from './routes/mediaRoute';
import tagRoute from './routes/tagRoute';
import chatRoute from './routes/chatRoute';
import commentRoute from './routes/commentRoute';
import themeRoute from './routes/themeRoute';
import friendRoute from './routes/friendRoute';
import notificationRoute from './routes/notificationRoute';
import likeRoute from './routes/likeRoute';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'media api v1',
  });
});

router.use('/media', mediaRoute);
router.use('/tags', tagRoute);
router.use('/chat', chatRoute);
router.use('/comment', commentRoute);
router.use('/theme', themeRoute);
router.use('/friends', friendRoute);
router.use('/notificaitons', notificationRoute);
router.use('/like', likeRoute);

export default router;
