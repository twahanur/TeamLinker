import { createBrowserRouter, Link } from 'react-router-dom';
import Room from './pages/Room/Room';
import RequestRoom from './components/RequestRoom/RequestRoom';
import GetCameraPermission from './components/GetCameraPermission/GetCameraPermission';
import Home from './pages/Home/Home';

const route = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/:id',
            element: <RequestRoom>
                <GetCameraPermission>
                    <Room />
                </GetCameraPermission>
            </RequestRoom>
        },
    ]);

    return router;
};

export default route;