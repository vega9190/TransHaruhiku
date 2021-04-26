using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TransHaruhiko.Models.DbModels;

namespace TransHaruhiko.Services.Impl
{
    public class HaberesService : IHaberesService
    {
        private readonly TransHaruhikoDbContext _dbContext;

        public HaberesService(TransHaruhikoDbContext dbContext)
        {
            _dbContext = dbContext;
        }
    }
}