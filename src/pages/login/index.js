/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import swal from "sweetalert";

import '../../assets/sass/style.scss'
import '../../assets/sass/style.react.scss'
//import * as os from 'os';
//import { AllOut } from '@mui/icons-material'
//import {toAbsoluteUrl} from '../../../../_metronic/helpers'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: 'admin@demo.com',
  password: 'demo',
}

/*
  Formik+YUP+Typescript:
  https://jaredpalmer.com/formik/docs/tutorial#getfieldprops
  https://medium.com/@maurice.de.beijer/yup-validation-and-typescript-and-formik-6c342578a20e
*/

export default function Login() {
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(false)
    },
  })

  const [name, setState1] = useState('');
  const [password, setState2] = useState('');

  const onChange = (e) => { setState1(e.target.value); }
  const onChange1 = (e) => { setState2(e.target.value); }

  // const getIPAddress = () => {
  //   //const { networkInterfaces } = os;
  //   const nets = os.networkInterfaces();
  //   const results = {};

  //   for (const name of Object.keys(nets)) {
  //     for (const net of nets[name]) {
  //       // Retrieve only IPv4 addresses
  //       if (net.family === 'IPv4' && !net.internal) {
  //         if (!results[name]) {
  //           results[name] = [];
  //         }
  //         results[name].push(net.address);
  //       }
  //     }
  //   }

  //   // Return the first IP address for the first NIC found
  //   const nicNames = Object.keys(results);
  //   if (nicNames.length > 0) {
  //     const firstNICAddresses = results[nicNames[0]];
  //     if (firstNICAddresses.length > 0) {
  //       return firstNICAddresses[0];
  //     }
  //   }

  //   // No IP address found
  //   return null;
  // };


  useEffect(() => {
    document.body.classList.add('bg-white')
    return () => {
      document.body.classList.remove('bg-white')
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      if (localStorage.getItem("token").split(" ")[0] === "Frog") {
        axios.post("http://192.168.40.33:7150/auth/", { token: localStorage.getItem("token") })
          .then((res) => {
            if (res.data.message === "success_auth") {
              window.location.href = "/";
            }
          })
          .catch((error) => {
            error = new Error();
          });
      }
    }
  }, []);

  const handleClick = () => {
    axios.post("http://192.168.40.33:7150/login/", { user: { name: name, password: password } }).then((res) => {
      if (res.data.message === "Username or Password is Wrong!!!") {
        swal({
          text: res.data.message,
          icon: "error",
          type: "error"
        })
      }
      else {
        swal({
          text: res.data.message,
          icon: "success",
          type: "success"
        }).then(() => {
          window.location.href = "/";
        });
        localStorage.setItem('token', res.data.token);
      }
    });
  }

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        // backgroundImage: `url(${toAbsoluteUrl('/media/illustrations/sketchy-1/14.png')})`,
      }}
    >
      {/* begin::Content */}
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-12'>
          {/* <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-1.svg')} className='h-45px' /> */}
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>



          <form
            className='form w-100'
            onSubmit={formik.handleSubmit}
            noValidate
            id='kt_login_signin_form'
          >
            {/* begin::Heading */}
            <div className='text-center mb-10'>
              <h1 className='text-dark mb-3'>Sign In to TaskView</h1>
              <div className='text-gray-400 fw-bold fs-4'>
                New Here?{' '}
                <Link to='/register' className='link-primary fw-bolder'>
                  Create an Account
                </Link>
              </div>
            </div>
            {/* begin::Heading */}

            

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
              <label className='form-label fs-6 fw-bolder text-dark'>Username</label>
              <input
                placeholder='Username'
                {...formik.getFieldProps('name')}
                className={clsx(
                  'form-control form-control-lg form-control-solid'
                )}
                onChangeCapture={onChange}
                value={name}
                type='name'
                name='name'
                autoComplete='off'
              />
              {formik.touched.email && formik.errors.email && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{formik.errors.email}</span>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
              <div className='d-flex justify-content-between mt-n5'>
                <div className='d-flex flex-stack mb-2'>
                  {/* begin::Label */}
                  <label className='form-label fw-bolder text-dark fs-6 mb-0'>Password</label>
                  {/* end::Label */}
                  {/* begin::Link */}
                  <Link
                    to='/auth/forgot-password'
                    className='link-primary fs-6 fw-bolder'
                    style={{ marginLeft: '5px' }}
                  >
                    Forgot Password ?
                  </Link>
                  {/* end::Link */}
                </div>
              </div>
              <input
                type='password'
                autoComplete='off'
                onChangeCapture={onChange1}
                value={password}
                name="password"
                {...formik.getFieldProps('password')}
                className={clsx(
                  'form-control form-control-lg form-control-solid',
                  {
                    'is-invalid': formik.touched.password && formik.errors.password,
                  },
                  {
                    'is-valid': formik.touched.password && !formik.errors.password,
                  }
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Action */}
            <div className='text-center'>
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='btn btn-lg btn-primary w-100 mb-5'
                disabled={!formik.isValid}
                onClick={handleClick}
              >
                {!loading && <span className='indicator-label'>Continue</span>}
                {loading && (
                  <span className='indicator-progress' style={{ display: 'block' }}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>

              {/* end::Google link */}
            </div>
            {/* end::Action */}
          </form>




        </div>
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
      {/* begin::Footer */}
      <div className='d-flex flex-center flex-column-auto p-10'>
        <div className='d-flex align-items-center fw-bold fs-6'>
          <a href='#' className='text-muted text-hover-primary px-2'>
            About
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact
          </a>

          <a href='#' className='text-muted text-hover-primary px-2'>
            Contact Us
          </a>
        </div>
      </div>
      {/* end::Footer */}
    </div>
  )
}
