const saveUserModel = async function (db, data) {
  return new Promise(function (resolve, reject) {
    db.serialize(() => {
      db.all(        
        `INSERT INTO user (uuid, first_name, last_name, email, password, phone, user_picture_name) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *; `,
        [
          data.uuid,
          data.first_name,
          data.last_name,
          data.email,
          data.password,
          data.phone,
          data.user_picture_name
        ],
        (error, rows) => {
          if (error) {
            console.log(error)
            reject();
          }
          resolve(rows);
          // db.close();
        }
      );      
    });

  });
};

export default saveUserModel;