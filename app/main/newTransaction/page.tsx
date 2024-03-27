'use client'

import { context } from '@/app/contexts';
import React, { useContext, useRef, useState } from 'react'

const NewTransaction = () => {
  const [isIncome, setIsIncome] = useState(true);
  const [isloading, setisloading] = useState(false);
  const amount = useRef<any>(null);
  const description = useRef<any>(null);
  const account = useRef<any>(null);
  const category = useRef<any>(null);
  const ctx = useContext(context);

  const addTransaction = () => {
    setisloading(true);
    ctx?.addTransaction(
      amount.current.value,
      description.current.value,
      account.current.value,
      isIncome,
      category.current.value
    )
  }

  return (
    <div className='h-full flex flex-col justify-center place-items-center'>
  <input ref={amount} className='p-3 w-11/12 font-bold text-2xl bg-gray-500 rounded-t-lg' type="number" placeholder='Amount' />

      <div className='h-1 w-11/12 gradient-1 mb-3'></div>
      <input ref={description} className='p-3 w-11/12  my-3 bg-gray-500   rounded-lg' type="text" placeholder="What's the income for?" />
      <div className='lg:flex justify-between w-11/12'>
        <select ref={account} className='p-3 lg:w-11/12 w-full lg:mr-4  my-3 bg-gray-500  rounded-lg focus:outline-none focus:border-none'>
          {ctx?.accounts.map(account => <option key={account.name} value={account.name}>{account.name}</option>)}
        </select>
        <select ref={category} className='p-3 lg:w-11/12 w-full lg:ml-4  my-3 bg-gray-500  rounded-lg focus:outline-none focus:border-none'>
          <option value="Food & Drinks">Food & Drinks</option>
          <option value="Shopping">Shopping</option>
          <option value="Housing">Housing</option>
          <option value="Transportation">Transportation</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Life & Entertainment">Life & Entertainment</option>
          <option value="Communication, PC">Communication, PC</option>
          <option value="Financial Expenses">Financial Expenses</option>
          <option value="Investments">Investments</option>
          <option value="Income">Income</option>
          <option value="Others">Others</option>
          <option value="Unknown">Unknown</option>
        </select>
      </div>
      <div className='flex lg:w-11/12 lg:justify-start justify-center my-3 transition-all'>
  <div className={`p-0.5 border border-gray-500 mr-6 transition-all hover:-translate-y-1`}>
    <button 
      onClick={() => setIsIncome(true)} 
      className={`p-3 px-12 bg-secondaryBlack ${isIncome ? '' : 'rounded-lg opacity-50'}`}
    >
      Income
    </button>
  </div>
  <div className={`p-0.5 border border-gray-500 transition-all hover:-translate-y-1`}>
    <button 
      onClick={() => setIsIncome(false)} 
      className={`p-3 px-12 bg-secondaryBlack ${!isIncome ? '' : 'rounded-lg opacity-50'}`}
    >
      Expenses
    </button>
  </div>
</div>

      {ctx?.error ? <div className='p-3 text-red-500'>{ctx?.error}</div> : null}
      <button onClick={addTransaction} className='bg-red-500 w-11/12 my-3 p-3 text-2xl font-bold rounded-lg transition-all hover:rotate-1 hover:scale-105'>{isloading ? <div className='h-full flex flex-col justify-center place-items-center'><span className="loader"></span></div> : <div>Add Transaction</div>}</button>
    </div>
  )
}

export default NewTransaction
