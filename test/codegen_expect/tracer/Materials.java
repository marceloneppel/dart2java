package tracer;

public abstract class Materials extends dart._runtime.base.DartObject implements tracer.Materials_interface
{
    public static dart._runtime.types.simple.InterfaceTypeInfo dart2java$typeInfo = new dart._runtime.types.simple.InterfaceTypeInfo(tracer.Materials.class, tracer.Materials_interface.class);
    private static dart._runtime.types.simple.InterfaceTypeExpr dart2java$typeExpr_bool = new dart._runtime.types.simple.InterfaceTypeExpr(dart._runtime.helpers.BoolHelper.dart2java$typeInfo);
    private static dart._runtime.types.simple.InterfaceTypeExpr dart2java$typeExpr_Object = new dart._runtime.types.simple.InterfaceTypeExpr(dart._runtime.helpers.ObjectHelper.dart2java$typeInfo);
    static {
      tracer.Materials.dart2java$typeInfo.superclass = dart2java$typeExpr_Object;
    }
    public double gloss;
    public double transparency;
    public double reflection;
    public double refraction;
    public boolean hasTexture;
  
    public Materials(dart._runtime.helpers.ConstructorHelper.EmptyConstructorMarker arg, dart._runtime.types.simple.Type type)
    {
      super(arg, type);
    }
  
    public abstract tracer.Color_interface getColor_(java.lang.Number u, java.lang.Number v);
    public java.lang.Object wrapUp(java.lang.Object t)
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      t = dart._runtime.helpers.DynamicHelper.invoke("operatorModulus", t, 2.0);
      if (((boolean) dart2java$localTypeEnv.evaluate(dart2java$typeExpr_bool).cast(dart._runtime.helpers.DynamicHelper.invoke("operatorLess", t, (-1)))))
      {
        t = dart._runtime.helpers.DynamicHelper.invoke("operatorPlus", t, 2.0);
      }
      if (((boolean) dart2java$localTypeEnv.evaluate(dart2java$typeExpr_bool).cast(dart._runtime.helpers.DynamicHelper.invoke("operatorGreaterEqual", t, 1))))
      {
        t = dart._runtime.helpers.DynamicHelper.invoke("operatorMinus", t, 2.0);
      }
      return t;
    }
    public void _constructor(double reflection, double transparency, double gloss, double refraction, boolean hasTexture)
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      this.reflection = reflection;
      this.transparency = transparency;
      this.gloss = gloss;
      this.refraction = refraction;
      this.hasTexture = hasTexture;
      super._constructor();
    }
    public double getGloss()
    {
      return this.gloss;
    }
    public double getTransparency()
    {
      return this.transparency;
    }
    public double getReflection()
    {
      return this.reflection;
    }
    public double getRefraction()
    {
      return this.refraction;
    }
    public boolean getHasTexture()
    {
      return this.hasTexture;
    }
}
