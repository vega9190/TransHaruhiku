﻿using System.Linq;
using TransHaruhiko.Models.DbModels;
using TransHaruhiko.Models.DbModels.Entidades;

namespace TransHaruhiko.Services.Impl
{
    public class UsuariosService : IUsuariosService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public UsuariosService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Usuario Get(string userName, string password)
        {
            if (string.IsNullOrEmpty(password))
            {
                var id = int.Parse(userName);
                return _dbContext.Usuarios.Find(id);
            }
            else
            {
                return _dbContext.Usuarios.FirstOrDefault(a => a.Nickname == userName && a.Pass == password);
            }
        }
    }
}