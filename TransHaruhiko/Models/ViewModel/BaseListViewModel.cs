using System;
using System.Linq;
using System.Reflection;

namespace TransHaruhiko.Models.ViewModel
{
    public class BaseListViewModel
    {
        private const string SCRIPT_COLUMN_NAME_SEPARATOR_1 = "-";
        private const string SCRIPT_COLUMN_NAME_SEPARATOR_2 = "_";
        public string OrderColumnName { set; get; }
        public string OrderDirection { set; get; }

        protected int pagina = 1;
        protected int itemsPerPage = int.Parse(System.Configuration.ConfigurationManager.AppSettings["RegistrosPorPagina"].Split('|')[0]);

        public int PageIndex
        {
            set { pagina = value; }
            get { return pagina; }
        }
        public bool Ascendente
        {
            get { return string.IsNullOrEmpty(OrderDirection) || OrderDirection.ToLower().Trim().Equals("asc"); }
        }
        public int ItemsPerPage
        {
            set { itemsPerPage = value; }
            get { return itemsPerPage; }
        }
        public T GetEnum<T>(T defaultValue)
            where T : struct, IConvertible
        {
            var orderColumnName = OrderColumnName ?? "";
            var field = typeof(T).GetFields(BindingFlags.Static | BindingFlags.Public)
                .FirstOrDefault(f => f.Name.ToLower()
                                     == orderColumnName.ToLower()
                                         .Replace(SCRIPT_COLUMN_NAME_SEPARATOR_1, string.Empty)
                                         .Replace(SCRIPT_COLUMN_NAME_SEPARATOR_2, string.Empty));

            if (field == null) return defaultValue;
            return (T)field.GetValue(null);
        }
    }
}