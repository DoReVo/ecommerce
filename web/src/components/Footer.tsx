function Footer() {
  return (
    <div className="bg-brand-light p-4 text-white w-full flex justify-around font-sans items-center">
      <div className="font-bold text-lg">Mesrinah Sdn Bhd.</div>

      <div>
        <div className="text-lg font-bold ">Branches</div>

        <ul className="list-disc">
          <li>Bandar Saujana Putra</li>
          <li>Temerloh</li>
        </ul>
      </div>

      <div>
        <div className="text-lg font-bold">Contacts</div>
        <div>Email: krul_aha85@yahoo.com</div>
        <div>Phone number: 012-545 7213</div>
      </div>
    </div>
  );
}

export default Footer;
