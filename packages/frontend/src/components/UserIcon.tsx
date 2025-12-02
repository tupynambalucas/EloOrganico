import { type FC, useEffect, useState  } from 'react';
import UserIconsList from '@assets/components/UserIconsList'


interface UserIconProps {}

const UserIcon: FC<UserIconProps> = (iconinput) => {
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        setIcon(UserIconsList.find(i => i.name === iconinput));
    }, [iconinput]);

    return (
        <div>
            <img src={icon?.base64} alt={icon?.name} />
        </div>
    );
}

export default UserIcon;