import React, { useContext } from 'react'
import {Context} from "../../main"
import {Link} from "react-router-dom"
import { FaGithub , FaLinkedin} from "react-icons/fa"
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill} from "react-icons/ri"
function Footer() {
  const {isAuthorized}  = useContext(Context)
  return (
    <footer className= {isAuthorized ? "footerShow" : "footerHide"}>
<div>&copy; All Rights Reserved by Bil-2.</div>
<div>
  <Link to={'https://github.com/Bil-2'} target='github'><FaGithub></FaGithub></Link>
  <Link to={'https://leetcode.com/u/Bil-2/'} target='leetcode'><SiLeetcode></SiLeetcode></Link>
  <Link to={'https://www.linkedin.com/in/biltu-bag-01b5172a7?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'} target='linkedin'><FaLinkedin></FaLinkedin></Link>
  <Link to={'https://www.instagram.com/bil2_2005?igsh=ajAwZTFrMjJ1Y3hj&utm_source=qr'} target='instagram'><RiInstagramFill></RiInstagramFill></Link>
</div>
      
    </footer>
  )
}

export default Footer