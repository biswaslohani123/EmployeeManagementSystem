import React, { useCallback, useEffect, useState } from 'react'
import { dummyEmployeeData, dummyPayslipData } from '../assets/assets';
import Loading from '../components/Loading';
import PaySlipList from '../components/payslip/PaySlipList';
import GeneratePayslipForm from '../components/payslip/GeneratePayslipForm';

const PaySlips = () => {

  const [payslips, setPaySlips] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = true;

  const fetchPaySlips = useCallback(async () => {

    setPaySlips(dummyPayslipData)
    setTimeout(() => {
        setLoading(false)
    }, 1000)

  },[])

  useEffect(() => {
    fetchPaySlips()
  },[fetchPaySlips]);

  useEffect(() => {
      if(isAdmin) setEmployee(dummyEmployeeData);
  },[isAdmin])

  if(loading) return <Loading/>

  return (

    <div className='animate-fade-in'>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
        <div>
          <h1 className='page-title'>Payslips</h1>
          <p className='page-subtitle'>{isAdmin ? "Generate and manage employee payslips" : "Your payslip history."}</p>
        </div>

        {
          isAdmin && <GeneratePayslipForm employee={employee} onSuccess={fetchPaySlips} />
        }
      </div>

        <PaySlipList payslips={payslips} isAdmin={isAdmin}/>

    </div>
  )
}

export default PaySlips