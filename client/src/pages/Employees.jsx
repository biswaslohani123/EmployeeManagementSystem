import React, { useCallback, useEffect, useState } from 'react'
import { dummyEmployeeData } from '../assets/assets';

const Employees = () => {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = useCallback(async () => {

    setLoading(true);
    setEmployees(dummyEmployeeData);
    setTimeout(() => {
        setLoading(false)
    }, 1000)
    
  }, [])

  useEffect(() => {

    fetchEmployees();

  },[])

  return (
    <div>Employees</div>
  )
}

export default Employees