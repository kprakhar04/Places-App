import React, { useEffect, useState } from 'react'
// import axios from 'axios'
import UsersList from '../components/UsersList'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook'

const Users = () => {

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users');
                setLoadedUsers(responseData.users);
            } catch (err) {
            }
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading &&
                (<div className="center">
                    <LoadingSpinner />
                </div>
                )}
            {!isLoading && loadedUsers.length > 0 && <UsersList items={loadedUsers} />}
        </>
    )
}
export default Users;