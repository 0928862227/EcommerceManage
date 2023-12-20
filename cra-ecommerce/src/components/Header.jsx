import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart,faBell,faQuestion,faEarthAsia } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import style from './Header.module.css';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className={style.Header}>
      <div className={style.logo}>
        <img src={logo} alt={logo} />
      </div>
      <div className={style.search_and_mini_nav}>
        <div className={style.search_bar}>
          <input type="text" placeholder="Chúng tôi bao ship 0Đ - Đăng ký ngay!" />
          <button type="submit"><div >
          <FontAwesomeIcon icon={faSearch} /></div></button>
        </div>
      </div>
        <div>
        <nav className={style.navbar_left}>
          <ul>
            <li><a href="#">Kênh người bán</a></li>
            <li><a href="#">Trở thành người bán</a></li>
            <li><a href="#">Tải ứng dụng</a></li>
            <li className={style.lastItem}><a href="#">Liên hệ</a></li>          
          </ul>
        </nav>
        </div>
        <div>
        <nav className={style.navbar_right}>
          <ul>
            <li><a href="#"><FontAwesomeIcon icon={faBell} className={style.fixSizeIcon}/> Thông báo</a></li>
            <li><a href="#"><FontAwesomeIcon icon={faQuestion} className={style.fixSizeIcon}/> Hỗ trợ</a></li>
            <li><a href="#"><FontAwesomeIcon icon={faEarthAsia} className={style.fixSizeIcon}/> Tiếng việt</a></li>
            <li><a href="#">Đăng ký</a></li>
            <li className={style.lastItem}><a href="#">Đăng nhập</a></li>
          </ul>
        </nav>
        </div>
        
      <div className={style.icons_cart}>
        <FontAwesomeIcon icon={faShoppingCart} />
      </div>
    </header>
  );
};

export default Header;
