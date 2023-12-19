import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import * as RiIcons from 'react-icons/ri';
import { Button } from 'bootstrap';

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 287px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;
const Logout =
{
  title: 'Logout',
  path: '/temp',
  icon: <FaIcons.FaSignOutAlt />,

  iconClosed: <RiIcons.RiArrowDownSFill />,
  iconOpened: <RiIcons.RiArrowUpSFill />,
}

const Sidebar = () => {
  const [sidebar, setSidebar] = useState(true);

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <Nav>
          <h1 style={{ color: 'white', padding: '50%', fontSize: '40px' }}>TaskView</h1>
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon>
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
            {/* <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br> */}
            <SubMenu item={Logout} />
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  );
};

export default Sidebar;
