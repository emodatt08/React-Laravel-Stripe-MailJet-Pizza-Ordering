import React, { useEffect } from 'react'
import { useNavigate} from 'react-router-dom';

function AdminLogout() {
    let navigate = useNavigate();
    useEffect(() => {
        localStorage.setItem('pizzeria.sanctum', '')
        navigate('/');
    }, [])
    
  return (
    <div>Logging Out</div>
  )
}

export default AdminLogout