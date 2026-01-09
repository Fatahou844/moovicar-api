"use strict";

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserProfile.init(
    {
      userId: DataTypes.INTEGER,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      dateNaissance: DataTypes.DATE,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      googleId: DataTypes.STRING,
      facebookId: DataTypes.STRING,
      verification_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNumber: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      immatriculation: DataTypes.STRING,
      tvaNumber: DataTypes.STRING,
      statusDriver: DataTypes.ENUM("0", "1"),
      OpenID: DataTypes.STRING,
      access_tokenPaypal: DataTypes.STRING,
      app_id: DataTypes.STRING,
      AcceptanceRate: DataTypes.FLOAT,
      ResponseRate: DataTypes.FLOAT,
      EngagementRate: DataTypes.FLOAT,
      EvaluationNumber: DataTypes.INTEGER,
      Finalizedtrips: DataTypes.INTEGER,
      PermisConduire: DataTypes.BOOLEAN,
      PieceIdentite: DataTypes.BOOLEAN,
      ExpertVitesseManuelle: DataTypes.BOOLEAN,
      stripeCustomerId: DataTypes.STRING,
      stripeAccountId: DataTypes.STRING,
      last4: DataTypes.STRING,
      exp_month: DataTypes.STRING,
      exp_year: DataTypes.STRING,
      PermisConduireDoc: DataTypes.STRING,
      PieceIdentityDoc: DataTypes.STRING,
      ImmatriculationDoc: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
