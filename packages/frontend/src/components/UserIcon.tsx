import { type FC, useEffect, useState  } from 'react';
import userIconList from '@/constants/userIconList'


interface UserIconProps {}

const UserIcon: FC<UserIconProps> = (iconinput) => {
    const [icon, setIcon] = useState(null);

    useEffect(() => {
        setIcon(userIconList.find(i => i.name === iconinput));
    }, [iconinput]);

    return (
        <div>
            <img src={icon?.base64} alt={icon?.name} />
        </div>
    );
}

export default UserIcon;